import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query, limit } from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/firestore';
import { shuffleArray } from '../Utils/shuffleArray'; 


const images = [
  require('../assets/TestIcon/testlistimg1.jpg'),
  require('../assets/TestIcon/testlistimg2.jpg'),
  require('../assets/TestIcon/testlistimg3.jpg'),
];

const useFetchTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const q = query(collection(firebase.firestore(), 'tests'), orderBy('createdAt', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        const fetchedTests = [];
        querySnapshot.forEach((doc) => {
          fetchedTests.push({ id: doc.id, ...doc.data() });
        });
        // Shuffle the images and assign one to each test
        const shuffledImages = shuffleArray(images);
        const testsWithImages = fetchedTests.map((test, index) => ({
          ...test,
          image: shuffledImages[index % shuffledImages.length]
        }));
        setTests(testsWithImages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tests: ', error);
      }
    };

    fetchTests();
  }, []);

  return { tests, loading };
};

export default useFetchTests;
