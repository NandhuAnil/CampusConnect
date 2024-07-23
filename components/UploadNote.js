import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ToastAndroid } from 'react-native';
import CustomPicker from './CustomPicker';
import * as DocumentPicker from 'expo-document-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { MaterialIcons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import useNotes from '../Hooks/useNotes';
import { useSendNotification } from '../Hooks/useSendNotification';

const UploadNote = () => {
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [units, setUnits] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const { uploadSuccess, setUploadSuccess } = useNotes();
  const { sendNotifications } = useSendNotification();

  useEffect(() => {
    // Any logic to refresh or fetch new data can go here
  }, [uploadSuccess]);
  
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      copyToCacheDirectory: true
    });
    if (!result.canceled) {
      setSelectedFile(result.assets[0]);
    } else {
      setSelectedFile(null);
    }
  };


  const uploadNote = async () => {
    if (!selectedFile) {
      ToastAndroid.show('Please select a file', ToastAndroid.SHORT);
      return;
    }
    
    const filePath = `documents/${selectedFile.name}`;
    const storageRef = storage().ref(filePath);
    const uploadTask = storageRef.putFile(selectedFile.uri);
  
    try {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload progress:', progress);
        },
        (error) => {
          console.error('Upload failed:', error);
          alert('Upload failed. Please try again.');
        },
        async () => {
          const downloadURL = await storageRef.getDownloadURL();
          await firestore().collection('notes').add({
            subject,
            department,
            semester,
            units,
            downloadURL,
            fileName: selectedFile.name
          });
          await sendNotifications('Material Added', `New Notes Added for ${subject}`);
          ToastAndroid.show('Notes uploaded successfully', ToastAndroid.SHORT);
          setSubject('');
          setDepartment('');
          setSemester('');
          setUnits('');
          setSelectedFile(null);
          setUploadSuccess(prev => !prev);
        }
      );
    } catch (error) {
      ToastAndroid.show('Failed to upload note', ToastAndroid.SHORT);
      console.error('Upload error:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          placeholder="Subject"
          value={subject}
          onChangeText={setSubject}
          style={styles.input}
        />
        <CustomPicker
          placeholder="Select Department"
          selectedValue={department}
          onValueChange={setDepartment}
          options={[
            { label: "Information Technology", value: "Information Technology" },
            { label: "Computer Science", value: "Computer Science" },
          ]}
        />
        <CustomPicker
          placeholder="Select Semester"
          selectedValue={semester}
          onValueChange={setSemester}
          options={[
            { label: "Semester 1", value: "Semester 1" },
            { label: "Semester 2", value: "Semester 2" },
            { label: "Semester 3", value: "Semester 3" },
            { label: "Semester 4", value: "Semester 4" },
            { label: "Semester 5", value: "Semester 5" },
            { label: "Semester 6", value: "Semester 6" },
            { label: "Semester 7", value: "Semester 7" },
            { label: "Semester 8", value: "Semester 8" },
          ]}
        />
        <CustomPicker
          placeholder="Select Units"
          selectedValue={units}
          onValueChange={setUnits}
          options={[
            { label: "Unit 1", value: "Unit 1" },
            { label: "Unit 2", value: "Unit 2" },
            { label: "Unit 3", value: "Unit 3" },
            { label: "Unit 4", value: "Unit 4" },
            { label: "Unit 5", value: "Unit 5" },
          ]}
        />
        <TouchableOpacity style={styles.uploadFile} onPress={pickDocument} >
          <MaterialIcons name="cloud-upload" size={70} color="#196ffa" style={{ alignItems: "center" }}/>
          <Text style={{ fontSize: 16, color: COLORS.grey }}>Choose file</Text>
        </TouchableOpacity>
        {selectedFile && (
          <View style={styles.fileContainer}>
            <Text style={styles.fileInfo}><Text style={{ color: COLORS.black }}>Selected File:</Text> {selectedFile.name}</Text>
            <TouchableOpacity onPress={() => setSelectedFile(null)} >
              <MaterialIcons name="close" size={25} color="black" style={{ alignItems: "center" }} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity onPress={uploadNote} style={styles.btn} >
        <Text style={styles.btnText}>Upload</Text>
      </TouchableOpacity>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 20,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 5,
    borderColor: COLORS.primary,
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginBottom: 20,
    backgroundColor: COLORS.white,
  },
});

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: "100%",
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  input: {
    fontSize: 16,
    marginBottom: 10,
    padding: 13,
    backgroundColor: COLORS.white,
  },
  fileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    width: "100%",
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 10,
  },
  fileInfo: {
    marginRight: 10,
    fontSize: 16,
    color: COLORS.blue,
  },
  picker: {
    width: '80%',
    marginBottom: 20,
  },
  uploadFile: {
    width: "100%",
    height: 200,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.blue,
    marginBottom: 10,
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
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default UploadNote;
