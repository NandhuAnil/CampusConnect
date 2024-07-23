import { firebase } from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import '@react-native-firebase/storage';

// No need to initialize Firebase manually; @react-native-firebase does this automatically
// Initialize Auth with AsyncStorage persistence
// auth().setPersistence(auth.Auth.Persistence.LOCAL).catch((error) => {
//   console.error('Error setting auth persistence:', error);
// });

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
