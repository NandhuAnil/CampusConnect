import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import dayjs from "dayjs";
import COLORS from '../../constants/colors'

const ViewAnnouncement = () => {
  const [announcements, setAnnouncements] = useState([]);


  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const querySnapshot = await firestore()
          .collection('announcements')
          .orderBy('timestamp', 'desc') 
          .get();
        const announcementsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setAnnouncements(announcementsData);
      } catch (error) {
        console.error('Error fetching announcements: ', error);
      }
    };
  
    fetchAnnouncements();
  }, []);

  const handlePress = (fileType, fileUri) => {
    if (fileType && fileUri) {
      
    } else {
      alert('No file attached to this announcement.');
    }
  };

  const formatTimestamp = (timestamp) => {
    return dayjs(timestamp.toDate()).format("DD MMM YYYY hh:mm A");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.announcementContainer}
            onPress={() => handlePress(item.fileType, item.fileUri)}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.info}>{item.info} <Text style={styles.btn}>Click Here</Text></Text>
            <Text style={styles.date}>{formatTimestamp(item.timestamp)} </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No data found</Text>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  announcementContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 18,
    color: COLORS.secondary,
  },
  info: {
    marginTop: 5,
    fontSize: 16,
  },
  btn: {
    color: COLORS.blue,
    textDecorationLine: 'underline',
  },
  date: {
    fontSize: 10,
    marginTop: 10,
  },
});

export default ViewAnnouncement;
