import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Switch, ToastAndroid, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import COLORS from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSendNotification } from '../../Hooks/useSendNotification';

const CreateAnnouncement = () => {
  const [title, setTitle] = useState('');
  const [info, setInfo] = useState('');
  const [fileUri, setFileUri] = useState('');
  const [isFileEnabled, setIsFileEnabled] = useState(false);

  const { sendNotifications } = useSendNotification();

  const handleCreateAnnouncement = async () => {
    if (!title || !info) {
      ToastAndroid.show('Title and info are required.', ToastAndroid.SHORT);
      return;
    }
  
    try {
      const db = firestore();
      await db.collection('announcements').add({
        title,
        info,
        timestamp: firestore.FieldValue.serverTimestamp(),
        fileUri: isFileEnabled ? fileUri : null,
      });
      ToastAndroid.show('Announcement created successfully!', ToastAndroid.SHORT);
  
      // Create a new notification
      const newNotification = {
        id: Date.now().toString(),
        message: `New announcement created: ${title}`,
        timestamp: new Date(),
      };
  
      // Get the existing notifications
      const storedNotifications = await AsyncStorage.getItem('notifications');
      const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
  
      // Add the new notification
      notifications.push(newNotification);
  
      // Save the updated notifications back to AsyncStorage
      await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
      
      await sendNotifications(title, info);

      setTitle('');
      setInfo('');
      setFileUri('');
      setIsFileEnabled(false);
    } catch (error) {
      console.error("Error adding document: ", error);
      ToastAndroid.show('Failed to create announcement.', ToastAndroid.SHORT);
    }
  };
  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem('notifications');
      ToastAndroid.show('Storage cleared successfully', ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show('Failed to clear storage', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
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
              placeholder="Title for Announcement"
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
              value={info}
              onChangeText={setInfo}
            />
          </View>
        </View>
        <View style={styles.switchContainer}>
          <Text>Attach a file</Text>
          <Switch
            value={isFileEnabled}
            onValueChange={setIsFileEnabled}
          />
        </View>
        {isFileEnabled && (
          <TextInput
            style={styles.input}
            placeholder="File URI"
            value={fileUri}
            onChangeText={setFileUri}
          />
        )}
      </View>
      {/* <Button
        title="Clear Storage"
        onPress={clearStorage}
        color="red"
      /> */}
      <TouchableOpacity onPress={handleCreateAnnouncement} style={styles.btn}>
        <Text style={styles.btnText}>Create Announcement</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: COLORS.white
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  btn: {
    backgroundColor: COLORS.primary,
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  btnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  }
});

export default CreateAnnouncement;
