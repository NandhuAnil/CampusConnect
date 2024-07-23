import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, AppState, Image, ToastAndroid } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Fontisto, Entypo } from '@expo/vector-icons';
import useUserDetails from '../../Hooks/UserDetails'

const Question = ({ route, navigation }) => {
  const { testId } = route.params; 
  const { name, photoURL } = useUserDetails();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const testDoc = await firestore().collection('tests').doc(testId).get();
        if (testDoc.exists) {
          const test = testDoc.data();
          setQuestions(test.questions);
          setTimeLeft(test.duration);
          setLoading(false);
        } else {
          console.error('No such test!');
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
  
    fetchQuestions();
  }, [testId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          clearInterval(timer);
          // handleSubmit();
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState.match(/inactive|background/)) {
        handleSubmit();
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  const handleOptionSelect = (index) => {
    setSelectedOptionIndex(index);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = { type: 'multiple-choice', answer: index };
    setAnswers(newAnswers);
  };

  const handleInputChange = (text) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = { type: 'fill-in-the-blank', answer: text };
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    setSelectedOptionIndex(
      answers[currentQuestionIndex + 1]?.type === 'multiple-choice'
        ? answers[currentQuestionIndex + 1].answer
        : null
    );
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePrevQuestion = () => {
    setSelectedOptionIndex(
      answers[currentQuestionIndex - 1]?.type === 'multiple-choice'
        ? answers[currentQuestionIndex - 1].answer
        : null
    );
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleSubmit = async () => {
    const score = answers.reduce((acc, answerObj, index) => {
      const question = questions[index];
      if (question.type === 'multiple-choice' && answerObj?.answer === question.correctAnswerIndex) {
        return acc + 1;
      } else if (question.type === 'fill-in-the-blank' && answerObj?.answer?.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()) {
        return acc + 1;
      }
      return acc;
    }, 0);
  
    const timeTaken = Math.max(0, timeLeft);
  
    try {
      await firestore().collection('scores').add({
        name,
        photoURL,
        testId,
        score,
        timeTaken,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
      ToastAndroid.show('Score added successfully!', ToastAndroid.SHORT);
    } catch (error) {
      console.error("Error saving score: ", error);
      ToastAndroid.show('Error saving score. Please try again.', ToastAndroid.SHORT);
    }
    setScore(score);
    setShowScore(true);
  };

  const renderProgressBar = () => {
    return (
      <View style={styles.progressBar}>
        {questions.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.progressBlock,
              answers[index] !== undefined && styles.answeredBlock,
            ]}
            onPress={() => setCurrentQuestionIndex(index)}
          >
            <Text style={styles.progressText}>{index + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];
    if (question.type === 'multiple-choice') {
      return (
        <View style={styles.answerSection}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton(selectedOptionIndex === index)}
              onPress={() => handleOptionSelect(index)}
            >
              <Text style={styles.optionText(selectedOptionIndex === index)}><Fontisto name={selectedOptionIndex === index ? "radio-btn-active" : "radio-btn-passive"} size={24} style={styles.optionIcon(selectedOptionIndex === index)}  />  {option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    } else if (question.type === 'fill-in-the-blank') {
      return (
        <View style={styles.answerSection}>
          <TextInput
            style={styles.fillBlankInput}
            placeholder="Enter your answer"
            value={answers[currentQuestionIndex]?.answer || ""}
            onChangeText={handleInputChange}
          />
        </View>
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showScore ? (
        <View>
          <Image
            source={require('../../assets/TestIcon/trophy.gif')} 
            style={styles.gif}
            // resizeMode="contain" 
          />
          <Text style={styles.scoreSection}>You scored {score} out of {questions.length}</Text>
          <Button
            title="Continue"
            color="#c524ff"
            onPress={() => {
              setShowScore(false);
              setScore(0);
              setSelectedOptionIndex(null);
              setAnswers(Array(questions.length).fill(null));
              navigation.goBack();
            }}
          />
        </View>
      ) : (
        <View style={styles.quizSection}>
          <View>
            <Text style={styles.timerText}>Time Left: {timeLeft}s</Text>
            {renderProgressBar()}
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/TestIcon/Stars.gif')} 
                style={styles.gif}
                // resizeMode="contain" 
              />
              <Text style={styles.questionText}>
                {questions[currentQuestionIndex]?.question || 'Loading question...'}
              </Text>
            </View>
            {renderQuestion()}
          </View>
          <View style={styles.navigationBar}>
            <View style={styles.navigationButtons}>
              <TouchableOpacity 
                onPress={handlePrevQuestion} 
                style={[
                  styles.button,
                  { opacity: currentQuestionIndex > 0 ? 1 : 0.5 }, 
                ]}
                disabled={currentQuestionIndex === 0}
              >
                <Entypo name="chevron-thin-left" size={16} color="black" style={{ marginBottom: 3 }} />
                <Text style={{ fontSize: 17}}>Previous</Text>
              </TouchableOpacity>
              {currentQuestionIndex < questions.length - 1 ? (
                <TouchableOpacity onPress={handleNextQuestion} style={styles.button}>
                  <Text style={{ fontSize: 17}}>Next</Text>
                  <Entypo name="chevron-thin-right" size={16} color="black" style={{ marginBottom: 3 }} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                  <Text style={{ fontSize: 17, color: '#c524ff' }}>Submit</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  quizSection: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  questionSection: {
    fontSize: 24,
    position: 'absolute',
    top: 80,
  },
  answerSection: {
    flexDirection: 'column',
    marginTop: 10,
  },
  optionButton: (isSelected) => ({
    backgroundColor: isSelected ? '#c524ff' : '#DDDDDD',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  }),
  optionText: (isSelected) => ({
    color: isSelected ? '#fff' : '#000',
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  optionIcon: (isSelected) => ({
    color: isSelected ? '#fff' : '#000',
    fontSize: 16,
  }),
  fillBlankInput: {
    borderBottomWidth: 1,
    borderColor: '#000',
    fontSize: 18,
    padding: 10,
    marginVertical: 10,
  },
  navigationBar: {
    // marginTop: 300,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  scoreSection: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timerText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'flex-start',
    marginBottom: 20,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 5,
    marginBottom: 20,
  },
  progressBlock: {
    height: 30,
    width: 30,
    marginHorizontal: 2,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
  },
  answeredBlock: {
    backgroundColor: '#c524ff',
  },
  progressText: {
    color: '#FFFFFF', 
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gif: {
    width: "100%", 
    height: 200,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c524ff',
  },
  questionText: {
    position: 'absolute',
    textAlign: 'center',
    color: '#000', 
    fontSize: 20,
    paddingHorizontal: 10, 
  },
});


export default Question;
