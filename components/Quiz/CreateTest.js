import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Modal, ToastAndroid } from 'react-native';
import CustomPicker from '../CustomPicker';
import { Ionicons, Fontisto, Feather } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../constants/colors';
import { useSendNotification } from '../../Hooks/useSendNotification';

const CreateTest = () => {
  const { sendNotifications } = useSendNotification();
  const [testName, setTestName] = useState('');
  const [duration, setDuration] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [questionType, setQuestionType] = useState('multiple-choice');
  const [editIndex, setEditIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [attemptedTests, setAttemptedTests] = useState({});
  const [autoDeleteDays, setAutoDeleteDays] = useState('');

  const handleAddQuestion = () => {
    if (!currentQuestion || (questionType === 'multiple-choice' && (options.some(option => !option) || correctOptionIndex === null)) || (questionType === 'fill-in-the-blank' && !correctAnswer)) {
      ToastAndroid.show('Please fill in all fields for the current question.', ToastAndroid.SHORT);
      return;
    }

    const newQuestion = {
      type: questionType,
      question: currentQuestion,
      options: questionType === 'multiple-choice' ? options : [],
      correctAnswerIndex: questionType === 'multiple-choice' ? correctOptionIndex : null,
      correctAnswer: questionType === 'fill-in-the-blank' ? correctAnswer : null,
    };

    if (editIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editIndex] = newQuestion;
      setQuestions(updatedQuestions);
      setEditIndex(null);
    } else {
      setQuestions([...questions, newQuestion]);
    }

    setCurrentQuestion('');
    setOptions(['', '', '', '']);
    setCorrectOptionIndex(null);
    setCorrectAnswer('');
    setQuestionType('multiple-choice');
    setModalVisible(false);
  };

  const handleEditQuestion = (index) => {
    const questionToEdit = questions[index];
    setCurrentQuestion(questionToEdit.question);
    setOptions(questionToEdit.options);
    setCorrectOptionIndex(questionToEdit.correctAnswerIndex);
    setCorrectAnswer(questionToEdit.correctAnswer);
    setQuestionType(questionToEdit.type);
    setEditIndex(index);
    setModalVisible(true);
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleCreateTest = async () => {
    if (!testName || !duration || questions.length === 0) {
      ToastAndroid.show('Please fill in all required fields and add at least one question.', ToastAndroid.SHORT);
      return;
    }
  
    try {
      await firestore().collection("tests").add({
        name: testName,
        duration: parseInt(duration),
        questions: questions,
        createdAt: firestore.FieldValue.serverTimestamp(),
        autoDeleteDays: parseInt(autoDeleteDays),
      });
      await sendNotifications("Campus Connect", `New quiz ${testName}`)
      ToastAndroid.show('Test created successfully!', ToastAndroid.SHORT);
      setTestName('');
      setDuration('');
      setAutoDeleteDays('');
      setQuestions([]);
    } catch (error) {
      console.error('Error adding document: ', error);
      ToastAndroid.show('Failed to create test. Please try again later.', ToastAndroid.SHORT);
    }
  };
  

  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem('@attempted_tests');
      setAttemptedTests({});
      ToastAndroid.show('Storage cleared successfully', ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show('Failed to clear storage', ToastAndroid.SHORT);
    }
  };

  const renderQuestionItem = ({ item, index }) => (
    <View style={styles.questionItem}>
      <Text style={styles.question}>{`Question ${index + 1} : ${item.question}`}</Text>
      {item.type === 'multiple-choice' && (
        <>
          {item.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
            >
              <Text style={styles.optionText}><Fontisto name="radio-btn-active" size={24} style={styles.optionIcon}/>  {option}</Text>
            </TouchableOpacity>
          ))}
          <Text style={styles.correctAnswer}> <Text style={{color: COLORS.black}}>Correct answer:</Text> {item.options[item.correctAnswerIndex]}</Text>
        </>
      )}
      {item.type === 'fill-in-the-blank' && (
        <Text style={styles.correctAnswer}><Text style={{color: COLORS.black}}>Correct answer:</Text> {item.correctAnswer}</Text>
      )}
      <View style={styles.questionActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditQuestion(index)}
        >
          <Feather name="edit" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteQuestion(index)}
        >
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.testDetail}>
        <TextInput
          style={styles.input}
          value={testName}
          onChangeText={setTestName}
          placeholder="Title for test"
        />

        <TextInput
          style={styles.input}
          value={duration}
          onChangeText={setDuration}
          placeholder="Enter test duration in seconds"
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          value={autoDeleteDays}
          onChangeText={setAutoDeleteDays}
          placeholder="Enter auto-delete days"
          keyboardType="numeric"
        />
        <Button
          title="Add Question"
          color={COLORS.primary}
          onPress={() => setModalVisible(true)}
        />
      </View>

      <FlatList
        data={questions}
        renderItem={renderQuestionItem}
        keyExtractor={(item, index) => index.toString()}
        extraData={questions}
        showsVerticalScrollIndicator={false}
      />

      <Button
        title="Create Test"
        color={COLORS.primary}
        onPress={handleCreateTest}
      />

      <Button
        title="Clear Storage"
        onPress={clearStorage}
        color="red"
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Question Type:</Text>
            <CustomPicker
              placeholder="Select Department"
              selectedValue={questionType}
              onValueChange={(itemValue) => setQuestionType(itemValue)}
              options={[
                { label: 'Multiple Choice', value: 'multiple-choice' },
                { label: 'Fill in the Blank', value: 'fill-in-the-blank' },
              ]}
            />
            <Text style={styles.label}>Question:</Text>
            <TextInput
              style={styles.input}
              value={currentQuestion}
              onChangeText={setCurrentQuestion}
              placeholder="Enter question"
            />

            {questionType === 'multiple-choice' && (
              <>
                <Text style={styles.label}>Options:</Text>
                {options.map((option, idx) => (
                  <TextInput
                    key={idx}
                    style={styles.input}
                    value={option}
                    onChangeText={(value) => {
                      const newOptions = [...options];
                      newOptions[idx] = value;
                      setOptions(newOptions);
                    }}
                    placeholder={`Option ${idx + 1}`}
                  />
                ))}

                <Text style={styles.label}>Correct Answer:</Text>
                <TextInput
                  style={styles.input}
                  value={correctOptionIndex !== null ? options[correctOptionIndex] : ''}
                  onChangeText={(value) => setCorrectOptionIndex(options.findIndex(opt => opt === value))}
                  placeholder="Enter correct answer"
                />
              </>
            )}

            {questionType === 'fill-in-the-blank' && (
              <>
                <Text style={styles.label}>Correct Answer:</Text>
                <TextInput
                  style={styles.input}
                  value={correctAnswer}
                  onChangeText={setCorrectAnswer}
                  placeholder="Enter correct answer"
                />
              </>
            )}
    
            <View style={{ gap: 10 }} >
              <Button
                title={editIndex !== null ? "Update Question" : "Add Question"}
                color={COLORS.primary}
                onPress={handleAddQuestion}
              />

              <Button
                title="Close"
                color={COLORS.blue}
                onPress={() => setModalVisible(false)}
              />
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  testDetail: {
    backgroundColor: COLORS.white,
    padding: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  questionItem: {
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
    backgroundColor: COLORS.white,
  },
  question: {
    fontSize: 18,
    marginBottom: 5,
  },
  options: {
    fontSize: 16,
    marginBottom: 5,
  },
  correctAnswer: {
    fontSize: 16,
    marginTop: 5,
    color: COLORS.blue,
  },
  questionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  optionButton: {
    backgroundColor:'#DDDDDD',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  optionText: {
    color: '#000',
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionIcon: {
    color: '#000',
    fontSize: 16,
  },
});

export default CreateTest;
