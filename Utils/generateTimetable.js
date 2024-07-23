// utils/generateTimetable.js
export const generateTimetable = (staffs) => {
  const days = 6;
  const periodsPerDay = 8;
  
  // Initialize an empty timetable
  let timetable = Array.from({ length: days }, () => Array(periodsPerDay).fill(null));
  
  // Create a list of all possible time slots
  let availableSlots = [];
  for (let day = 0; day < days; day++) {
    for (let period = 0; period < periodsPerDay; period++) {
      availableSlots.push({ day, period });
    }
  }

  // Shuffle the available slots randomly
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };
  shuffleArray(availableSlots);

  // Assign periods to staff members randomly
  for (let staff of staffs) {
    for (let i = 0; i < staff.periodsPerWeek; i++) {
      if (availableSlots.length === 0) {
        throw new Error("Not enough available slots to schedule all periods");
      }
      let slot = availableSlots.pop();
      timetable[slot.day][slot.period] = `${staff.staffName} - ${staff.subject}`;
    }
  }

  return timetable;
};
