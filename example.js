import React, { useState } from 'react';
import { View, Button, TextInput, Alert } from 'react-native';
import { useSendNotification } from './Hooks/useSendNotification';

const NotificationComponent = () => {

  const { sendNotifications } = useSendNotification();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSendNotification = () => {
    if (title && body) {
      sendNotifications(title, body);
    } else {
      Alert.alert('Title and body are required.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, marginHorizontal: 22 }}>
          <View style={{ marginBottom: 12, marginTop: 22 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 400,
                marginVertical: 2,
              }}
            >
              Title :
            </Text>
  
            <View
              style={{
                width: "100%",
                height: 48,
                borderColor: COLORS.black,
                borderWidth: 1,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 22,
              }}
            >
              <TextInput
                placeholder="Title of your notification"
                placeholderTextColor={COLORS.black}
                style={{
                  width: "100%",
                }}
                value={title}
                onChangeText={setTitle}
              />
            </View>
          </View>
          <View style={{ marginBottom: 12 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 400,
                marginVertical: 2,
              }}
            >
              Information :
            </Text>
  
            <View
              style={{
                width: "100%",
                height: 48,
                borderColor: COLORS.black,
                borderWidth: 1,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 22,
              }}
            >
              <TextInput
                placeholder="Notification content"
                placeholderTextColor={COLORS.black}
                style={{
                  width: "100%",
                }}
                onChangeText={setBody}
                value={body}
              />
            </View>
          </View>
          <Button
            title="Send Notification"
            filled
            style={{
              marginTop: 18,
              marginBottom: 4,
            }}
            onPress={handleSendNotification}
          />
      </View>
    </View>
  );
};

export default NotificationComponent;
