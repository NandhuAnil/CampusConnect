import { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState({
    isLoggedIn: false,
    loading: true,
    name: '',
    email: '',
    phoneNumber: '',
    role: null,
    photoURL: null,
  });

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = await firestore().collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setUserDetails({
              isLoggedIn: true,
              loading: false,
              name: userData.name || '',
              role: userData.role || null,
              photoURL: userData.photoURL || null,
              email: userData.email || '',
              phoneNumber: userData.phoneNumber || '',
            });
          } else {
            setUserDetails({
              isLoggedIn: false,
              loading: false,
              name: '',
              email: '',
              phoneNumber: '',
              role: null,
              photoURL: null,
            });
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
          setUserDetails({
            isLoggedIn: false,
            loading: false,
            name: '',
            email: '',
            phoneNumber: '',
            role: null,
            photoURL: null,
          });
        }
      } else {
        setUserDetails({
          isLoggedIn: false,
          loading: false,
          name: '',
          email: '',
          phoneNumber: '',
          role: null,
          photoURL: null,
        });
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return userDetails;
};

export default useUserDetails;
