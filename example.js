import React, { useState } from 'react';
import { View, Button, TextInput } from 'react-native';
import { useSendNotification } from './Hooks/useSendNotification';

const NotificationComponent = () => {

  const { sendNotifications } = useSendNotification();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSendNotification = () => {
    if (title && body) {
      sendNotifications(title, body);
    } else {
      console.error('Title and body are required.');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Notification Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Notification Body"
        value={body}
        onChangeText={setBody}
      />
      <Button title="Send Notification" onPress={handleSendNotification} />
    </View>
  );
};

export default NotificationComponent;
