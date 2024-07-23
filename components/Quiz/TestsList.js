import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Modal, TouchableOpacity, ActivityIndicator, Image, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import COLORS from '../../constants/colors';
import { Entypo } from '@expo/vector-icons';
import useFetchTests from '../../Hooks/useFetchTests';

const TestsList = ({ navigation }) => {
  const { tests, loading } = useFetchTests();
  const [attemptedTests, setAttemptedTests] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Leaderboard', { testId: selectedTestId })}>
          <Entypo name="trophy" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const fetchAttemptedTests = async () => {
      const jsonValue = await AsyncStorage.getItem('@attempted_tests');
      setAttemptedTests(jsonValue != null ? JSON.parse(jsonValue) : {});
    };

    fetchAttemptedTests();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const jsonValue = await AsyncStorage.getItem('@attempted_tests');
      setAttemptedTests(jsonValue != null ? JSON.parse(jsonValue) : {});
    });

    return unsubscribe;
  }, [navigation]);

  const handleTakeTest = async (testId) => {
    if (attemptedTests[testId]) {
      ToastAndroid.show('You have already attempted this test.', ToastAndroid.SHORT);
    } else {
      setSelectedTestId(testId);
      setIsModalVisible(true);
    }
  };

  const handleStartQuiz = async () => {
    setIsModalVisible(false);
    await AsyncStorage.setItem('@attempted_tests', JSON.stringify({
      ...attemptedTests,
      [selectedTestId]: true,
    }));
    navigation.navigate('Question', { testId: selectedTestId }); // Navigate to Question component with testId
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#39B68D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Available Tests</Text> */}
      <FlatList
        data={tests}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.testItem}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.testDetails}>
              <Text style={styles.testName}>{item.name}</Text>
              <Text style={styles.testDuration}>Duration: {item.duration} seconds</Text>
            </View>
            <Text style={styles.para}>Before taking the quiz, ensure you are in a quiet, comfortable environment free from distractions. Take a moment to relax, breathe deeply, and focus. Remember to read each question carefully and manage your time wisely. Good luck!</Text>
            <Button
              title="Take Test"
              onPress={() => handleTakeTest(item.id)}
              disabled={!!attemptedTests[item.id]}
              color="#c524ff"
            />
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No data found</Text>}
      />
      {/* <Button
        title="View Leaderboard"
        onPress={() => navigation.navigate('Leaderboard')}
      /> */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Instructions</Text>
            <Text style={styles.modalText}>
              <Text style={styles.listItem}>1. </Text>
              You have limited time to complete the quiz.{"\n\n"}
              <Text style={styles.listItem}>2. </Text>
              Make sure to answer all questions.{"\n\n"}
              <Text style={styles.listItem}>3. </Text>
              You cannot go back once you submit the quiz.{"\n\n"}
              <Text style={styles.listItem}>4. </Text>
              Ensure a stable internet connection.{"\n\n"}
              <Text style={styles.listItem}>5. </Text>
              Do not switch apps, or the quiz will be submitted automatically.
            </Text>

            <View style={styles.checkboxContainer}>
              <Checkbox
                value={isChecked}
                onValueChange={setIsChecked}
              />
              <Text style={styles.checkboxText}>I have read and agree to the terms and conditions</Text>
            </View>
            <Button
              title="Start Quiz"
              onPress={handleStartQuiz}
              disabled={!isChecked}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  testItem: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  testDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  testName: {
    fontSize: 18,
  },
  testDuration: {
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxText: {
    fontSize: 12,
    marginLeft: 10,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  listItem: {
    fontWeight: 'bold',
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  para: {
    textAlign: 'justify',
    fontSize: 12,
  },
});

export default TestsList;
