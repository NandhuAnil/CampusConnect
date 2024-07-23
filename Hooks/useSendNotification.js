import firestore from '@react-native-firebase/firestore';

export const useSendNotification = () => {
  
  async function sendNotifications(title, body) {
    try {
      const tokens = await getUserTokensFromDatabase();
      if (tokens.length > 0) {
        console.log('Sending notification with tokens:', tokens);
        console.log('Notification title:', title);
        console.log('Notification body:', body);
  
        const response = await fetch('https://appsail-50021451195.development.catalystappsail.in/sendMulticastNotification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tokens: tokens,
            title,
            body,
          }),
        });
  
        const result = await response.text();
        console.log('Notification result:', result);
      } else {
        console.error('No tokens found to send notifications.');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
  

  return { sendNotifications };
};

const getUserTokensFromDatabase = async () => {
  const tokens = [];
  const snapshot = await firestore().collection('users').get();

  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.expoPushToken) {
      tokens.push(data.expoPushToken);
    }
  });
  console.log('getToken:==> ',tokens)
  return tokens;
};
