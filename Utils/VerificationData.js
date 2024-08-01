import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ToastAndroid,
  } from "react-native";
  import React, { useState } from "react";
  import * as DocumentPicker from "expo-document-picker";
  import Button from "../components/Button";
  import COLORS from "../constants/colors";
  import firestore from "@react-native-firebase/firestore";
  import { MaterialIcons } from "@expo/vector-icons";
  
  const VerificationData = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [values, setValues] = useState({
      name: "",
      enrollnumber: "",
    });
  
    function handleChange(text, eventName) {
      setValues((prev) => {
        return {
          ...prev,
          [eventName]: text,
        };
      });
    }
  
    const pickDocument = async () => {
      let result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        setSelectedFile(result.assets[0]);
      } else {
        setSelectedFile(null);
      }
    };
  
    const uploadSingleData = async () => {
      try {
        const docRef = firestore().collection("verificationData").doc("enrollNumbers");
        const doc = await docRef.get();
  
        if (doc.exists) {
          const currentData = doc.data();
          const currentEnrollNumbers = currentData.enrollNumbers || [];
  
          const updatedEnrollNumbers = [
            ...currentEnrollNumbers,
            { number: values.enrollnumber, username: values.name },
          ];
  
          await docRef.update({ enrollNumbers: updatedEnrollNumbers });
        } else {
          await docRef.set({
            enrollNumbers: [{ number: values.enrollnumber, username: values.name }],
          });
        }
  
        ToastAndroid.show("Student added successfully!", ToastAndroid.SHORT);
        setValues({ name: "", enrollnumber: "" });
      } catch (error) {
        console.error("Error uploading data: ", error);
        ToastAndroid.show("Failed to upload data.", ToastAndroid.SHORT);
      }
    };
  
    const uploadFileData = async () => {
      if (!selectedFile) {
        ToastAndroid.show("No file selected", ToastAndroid.SHORT);
        return;
      }
      try {
        const fileUri = selectedFile.uri;
        const response = await fetch(fileUri);
        const fileData = await response.json();
  
        const docRef = firestore().collection("verificationData").doc("enrollNumbers");
        const doc = await docRef.get();
  
        if (doc.exists) {
          const currentData = doc.data();
          const currentEnrollNumbers = currentData.enrollNumbers || [];
  
          const updatedEnrollNumbers = [...currentEnrollNumbers, ...fileData.enrollNumbers];
  
          await docRef.update({ enrollNumbers: updatedEnrollNumbers });
        } else {
          await docRef.set({ enrollNumbers: fileData.enrollNumbers });
        }
  
        ToastAndroid.show("File data uploaded successfully!", ToastAndroid.SHORT);
        setSelectedFile(null);
      } catch (error) {
        console.error("Error uploading file data: ", error);
        ToastAndroid.show("Failed to upload file data.", ToastAndroid.SHORT);
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
              Name :
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
                placeholder="Enter a student name"
                placeholderTextColor={COLORS.black}
                style={{
                  width: "100%",
                }}
                onChangeText={(text) => handleChange(text, "name")}
                value={values.name}
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
              Enroll Number :
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
                placeholder="Enter a student enrollnumber"
                placeholderTextColor={COLORS.black}
                style={{
                  width: "100%",
                }}
                onChangeText={(text) => handleChange(text, "enrollnumber")}
                value={values.enrollnumber}
                keyboardType="numeric"
              />
            </View>
          </View>
          <Button
            title="Add student"
            filled
            style={{
              marginTop: 18,
              marginBottom: 4,
            }}
            onPress={() => uploadSingleData()}
          />
  
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}
          >
            <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
            <View>
              <Text style={{ width: 50, textAlign: "center" }}>Or</Text>
            </View>
            <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
          </View>
  
          <TouchableOpacity style={styles.uploadFile} onPress={pickDocument}>
            <MaterialIcons
              name="cloud-upload"
              size={70}
              color="#196ffa"
              style={{ alignItems: "center" }}
            />
            <Text style={{ fontSize: 16, color: COLORS.grey }}>Choose file</Text>
          </TouchableOpacity>
          {selectedFile && (
            <View style={styles.fileContainer}>
              <Text style={styles.fileInfo}>
                <Text style={{ color: COLORS.black }}>Selected File:</Text>{" "}
                {selectedFile.name}
              </Text>
              <TouchableOpacity onPress={() => setSelectedFile(null)}>
                <MaterialIcons
                  name="close"
                  size={25}
                  color="black"
                  style={{ alignItems: "center" }}
                />
              </TouchableOpacity>
            </View>
          )}
  
          <Button
            title="Add Multiple students"
            filled
            style={{
              marginTop: 18,
              marginBottom: 4,
            }}
            onPress={() => uploadFileData()}
          />
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    fileContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
    uploadFile: {
      width: "100%",
      height: 200,
      backgroundColor: COLORS.white,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 50,
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: COLORS.blue,
      marginBottom: 10,
      marginTop: 20,
    },
  });
  
  export default VerificationData;
  