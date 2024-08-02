import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
  Alert,
  Pressable,
  ScrollView,
  Modal,
  ActivityIndicator,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import COLORS from "../constants/colors";

import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { MaterialIcons, Feather, AntDesign } from "@expo/vector-icons";
import * as Updates from 'expo-updates';
import * as ImagePicker from "expo-image-picker";
import ImageViewer from "../components/ImageViewer";

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [isAboutModalVisible, setIsAboutModalVisible] = useState(false);
  const [isHelpModalVisible, setIsHelpModalVisible] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);

  const checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Alert.alert(
          "Update Available",
          "A new update is available. Would you like to download and restart the app?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Update", onPress: () => applyUpdate() }
          ]
        );
      } else {
        Alert.alert("No updates available");
      }
    } catch (e) {
      Alert.alert("Error checking for updates", e.message);
    }
  };

  const applyUpdate = async () => {
    try {
      setIsUpdating(true);
      await Updates.fetchUpdateAsync();
      setUpdateProgress(100); // Simulating progress completion
      await Updates.reloadAsync();
    } catch (e) {
      Alert.alert("Error applying update", e.message);
    } finally {
      setIsUpdating(false);
      setUpdateProgress(0);
    }
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setName(userData.name);
          setEmail(userData.email);
          setPhoneNumber(userData.phoneNumber);
          setSelectedImage(userData.photoURL);
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  async function handleUpdate() {
    if (user) {
      try {
        await firestore().collection('users').doc(user.uid).update({
          name,
          email,
          phoneNumber,
        });
        setIsEditing(false);
        ToastAndroid.show("Profile updated Successfully!", ToastAndroid.SHORT);
      } catch (error) {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show("No user is signed in", ToastAndroid.SHORT);
    }
  }

  const handleLogout = () => {
    auth().signOut()
      .then(() => {
        ToastAndroid.show("Logged Out", ToastAndroid.SHORT);
      })
      .catch((error) => {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      });
  };

  const handleDeleteAccount = () => {
    if (user) {
      user.delete()
        .then(() => {
          ToastAndroid.show("Your Account deleted successfully", ToastAndroid.SHORT);
        })
        .catch((error) => {
          ToastAndroid.show(error.message, ToastAndroid.SHORT);
        });
    }
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      setSelectedImage(localUri);
      try {
        const imageUrl = await uploadImageAsync(localUri);
        ToastAndroid.show("Image uploaded successfully", ToastAndroid.SHORT);
        setSelectedImage(imageUrl);
      } catch (error) {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show("You did not select any image.", ToastAndroid.SHORT);
    }
  };

  async function uploadImageAsync(uri) {
    const user = auth().currentUser;
    if (!user) {
      throw new Error("No user is signed in");
    }

    const storageRef = storage().ref(`profileImages/${user.uid}`);
    const response = await fetch(uri);
    const blob = await response.blob();

    await storageRef.put(blob);

    const downloadURL = await storageRef.getDownloadURL();

    await firestore().collection('users').doc(user.uid).update({
      photoURL: downloadURL,
    });

    return downloadURL;
  }

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const generateAvatarUrl = (name) => {
    const firstLetter = name.charAt(0);
    const backgroundColor = getRandomColor();
    const imageSize = 130;
    return `https://ui-avatars.com/api/?background=${backgroundColor}&size=${imageSize}&color=FFF&font-size=0.60&name=${firstLetter}`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        style={{
          // flex: 1,
          height: 250,
          padding: 20,
        }}
        colors={[COLORS.primary, COLORS.secondary]}
      >
        {isEditing ? (
          <Feather name="arrow-left" size={26} color="white" onPress={() => setIsEditing(!isEditing)}/>
        ) : null}
        <View style={styles.imageContainer}>
          {isEditing ? (
            <View>
            <ImageViewer
              placeholderImageSource={generateAvatarUrl(name)}
              selectedImage={selectedImage}
              effect={styles.overlay} 
              onPress={pickImageAsync}
            />
            <AntDesign name="edit" size={24} color="white" style={{ position: 'absolute', top: "80%", left: "20%"}} />
            </View>
          ) : (
          <ImageViewer
            placeholderImageSource={generateAvatarUrl(name)}
            selectedImage={selectedImage}
          />
          )}
          <Text
            style={[
              styles.text,
              { fontWeight: "bold" },
            ]}
          >
            {name}
          </Text>
        </View>
      </LinearGradient>
      <ScrollView style={{ paddingLeft: 20, paddingRight: 10 }} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionTitle}>
          <Text
            style={[
              styles.sectionTitleText,
              { color: "#000" },
            ]}
          >
            Account Info
          </Text>
        </View>
        {isEditing ? (
          <View>
            <Text
              style={[styles.label, { color: "#000" }]}
            >
              Name
            </Text>
            <TextInput
              style={[styles.input, { color: "#000" }]}
              value={name}
              onChangeText={setName}
            />
          </View>
        ) : null}
        {isEditing ? (
          <View>
            <Text
              style={[styles.label, { color: "#000" }]}
            >
              Email
            </Text>
            <TextInput
              style={[styles.input, { color: "#000" }]}
              value={email}
              onChangeText={setEmail}
            />
          </View>
        ) : (
          <Text style={[styles.text, { color: "#000" }]}>
            {email}
          </Text>
        )}
        {isEditing ? (
          <View>
            <Text
              style={[styles.label, { color: "#000" }]}
            >
              Phone Number
            </Text>
            <TextInput
              style={[styles.input, { color: "#000" }]}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
        ) : (
          <Text style={[styles.text, { color: "#000" }]}>
            {phoneNumber}
          </Text>
        )}
        {isEditing && <Button title="Update Profile" onPress={handleUpdate} />}
        {!isEditing && 
        <View>
        <View style={styles.sectionTitle}>
          <Text
            style={[
              styles.sectionTitleText,
              { color: "#000" },
            ]}
          >
            More info and support
          </Text>
        </View>

        <View style={styles.helpAboutSection}>
          <Pressable
            onPress={() => setIsHelpModalVisible(true)}
            style={styles.helpAbout}
          >
            <View style={styles.AboutSection}>
              <MaterialIcons
                name="help"
                size={26}
                color={"black"}
              />
              <Text
                style={[
                  styles.sectionText,
                  { color: "#000" },
                  { paddingTop: 3 },
                ]}
              >
                Help
              </Text>
            </View>
            <View style={styles.AboutSection}>
              <MaterialIcons
                name="arrow-right"
                size={26}
                color={"black"}
                style={{ alignItems: "center" }}
              />
            </View>
          </Pressable>
          <Pressable
            onPress={() => setIsAboutModalVisible(true)}
            style={styles.helpAbout}
          >
            <View style={styles.AboutSection}>
              <MaterialIcons
                name="info"
                size={26}
                color={"black"}
              />
              <Text
                style={[
                  styles.sectionText,
                  { color: "#000" },
                  { paddingTop: 3 },
                ]}
              >
                About
              </Text>
            </View>
            <View style={styles.AboutSection}>
              <MaterialIcons
                name="arrow-right"
                size={26}
                color={"black"}
                style={{ alignItems: "center" }}
              />
            </View>
          </Pressable>
        </View>
        <Modal
          visible={isHelpModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsHelpModalVisible(false)}
        >
          <View style={styles.modalContainerHelp}>
            <View style={{flexDirection: "row", gap: 20}}>
              <Feather name="arrow-left" size={26} color={"black"} onPress={() => setIsHelpModalVisible(false)}/>
              <Text style={[styles.titleHeader,{top: -2, fontWeight: 'normal'}]}>Help</Text>
            </View>
            <Pressable
              onPress={() => Alert.alert("Help center","Currently unavailable we are working this feature")}
              style={styles.helpAbout}
            >
              <View style={styles.AboutSection}>
                <Text
                  style={[
                    styles.sectionText,
                    { color: "#000" },
                    { paddingTop: 3 },{paddingLeft: 10}
                  ]}
                >
                  Help center
                </Text>
              </View>
              <View style={styles.AboutSection}>
                <MaterialIcons
                  name="arrow-right"
                  size={26}
                  color={ "black"}
                  style={{ alignItems: "center" }}
                />
              </View>
            </Pressable>
            <Pressable
              onPress={() => Alert.alert("Report a problem","Currently unavailable we are working this feature")}
              style={styles.helpAbout}
            >
              <View style={styles.AboutSection}>
                <Text
                  style={[
                    styles.sectionText,
                    { color: "#000" },
                    { paddingTop: 3 },{paddingLeft: 10}
                  ]}
                >
                  Report a problem
                </Text>
              </View>
              <View style={styles.AboutSection}>
                <MaterialIcons
                  name="arrow-right"
                  size={26}
                  color={ "black"}
                  style={{ alignItems: "center" }}
                />
              </View>
            </Pressable>
            <Pressable
              onPress={() => Alert.alert("Support request","Currently unavailable we are working this feature")}
              style={styles.helpAbout}
            >
              <View style={styles.AboutSection}>
                <Text
                  style={[
                    styles.sectionText,
                    { color: "#000" },
                    { paddingTop: 3 },{paddingLeft: 10}
                  ]}
                >
                  Support request
                </Text>
              </View>
              <View style={styles.AboutSection}>
                <MaterialIcons
                  name="arrow-right"
                  size={26}
                  color={"black"}
                  style={{ alignItems: "center" }}
                />
              </View>
            </Pressable>
          </View>
        </Modal>

        <Modal
          visible={isAboutModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsAboutModalVisible(false)}
        >
          <ScrollView>
            <View style={styles.modalContainerHelp}>
            <View style={{flexDirection: "row", gap: 20}}>
              <Feather name="arrow-left" size={26} color={ "black"} onPress={() => setIsAboutModalVisible(false)}/>
              <Text style={[styles.titleHeader,{top: -2, fontWeight: 'normal'}]}>About</Text>
            </View>
              <View style={styles.modalContent}>
                <Text
                  style={[
                    styles.modalTitle,
                    { color: "#000" },
                  ]}
                >
                  About Engineering Student Helper
                </Text>
                <Text
                  style={[
                    styles.modalText,
                    { color: "#000" },
                  ]}
                >
                  Welcome to the Engineering Student Helper, your all-in-one
                  solution for academic support and collaboration. Our app is
                  designed to enhance your learning experience with a range of
                  features tailored to meet the needs of engineering students.
                </Text>
                <Text style={styles.titleHeader}>Key Features:</Text>

                <View style={styles.featureItem}>
                  <Text style={styles.featureTitle}>
                    Real-Time Notifications
                  </Text>
                  <Text style={styles.featureDescription}>
                    Stay updated with the latest announcements, assignments, and
                    exam schedules. Never miss an important update with our
                    real-time notification system.
                  </Text>
                </View>

                <View style={styles.featureItem}>
                  <Text style={styles.featureTitle}>
                    Anytime Access to Study Notes
                  </Text>
                  <Text style={styles.featureDescription}>
                    Access a comprehensive collection of study notes and
                    materials anytime, anywhere. Our resources are curated to
                    help you succeed in your coursework and exams.
                  </Text>
                </View>

                <View style={styles.featureItem}>
                  <Text style={styles.featureTitle}>Feedback and Queries</Text>
                  <Text style={styles.featureDescription}>
                    Share your feedback and ask questions directly through the
                    app. Our support team and fellow students are here to help
                    you with any academic challenges.
                  </Text>
                </View>

                <View style={styles.featureItem}>
                  <Text style={styles.featureTitle}>Online Tests</Text>
                  <Text style={styles.featureDescription}>
                    Conduct and participate in online tests seamlessly within
                    the app. Prepare for your exams with practice tests and
                    quizzes designed to enhance your understanding.
                  </Text>
                </View>

                <View style={styles.featureItem}>
                  <Text style={styles.featureTitle}>
                    Circulars from Department Heads
                  </Text>
                  <Text style={styles.featureDescription}>
                    Receive important circulars and updates directly from your
                    department heads. Stay informed about departmental news,
                    events, and policies.
                  </Text>
                </View>
                <Text
                  style={[
                    styles.modalText,
                    { color: "#000" },
                  ]}
                >
                  At Engineering Student Helper, we are committed to providing a
                  supportive and efficient learning environment. Our goal is to
                  help you achieve academic excellence and stay connected with
                  your peers and instructors. Thank you for choosing us as your
                  academic companion!
                </Text>
                <Pressable
                  onPress={() => setIsAboutModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={{ color: "#fff", fontSize: 18 }}>Close</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </Modal>

        <View style={styles.sectionTitle}>
          <Text
            style={[
              styles.sectionTitleText,
              { color: "#000" },
            ]}
          >
            Edit Profile
          </Text>
        </View>

        <View style={styles.btnSwitch}>
          <Pressable onPress={() => setIsEditing(!isEditing)} style={styles.helpAbout}>
            <Text style={[styles.sectionText, { color: "#196ffa" }]}>Edit Details</Text>
          </Pressable>
        </View>

        <View style={styles.sectionTitle}>
          <Text
            style={[
              styles.sectionTitleText,
              { color: "#000" },
            ]}
          >
            Logins
          </Text>
        </View>

        <View style={styles.btnSwitch}>
          <Pressable onPress={handleLogout} style={styles.helpAbout}>
            <Text style={[styles.sectionText, { color: "red" }]}>Logout</Text>
          </Pressable>
          <Pressable onPress={handleDeleteAccount} style={styles.helpAbout}>
            <Text style={[styles.sectionText, { color: "red" }]}>
              Delete Account
            </Text>
          </Pressable>
        </View>

        <View style={styles.sectionTitle}>
          <Text
            style={[
              styles.sectionTitleText,
              { color: "#000" },
            ]}
          >
            Updates
          </Text>
        </View>

        <View>
            <TouchableOpacity onPress={checkForUpdates} style={styles.updatebtn}>
              <Text style={{ color: COLORS.white, fontSize: 16}}>Check for updates</Text>
            </TouchableOpacity>
        </View>

        <Modal
          transparent={true}
          animationType="slide"
          visible={isUpdating}
          onRequestClose={() => setIsUpdating(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' }}>
              <Text>Downloading Update...</Text>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text>{`Progress: ${updateProgress}%`}</Text>
            </View>
          </View>
        </Modal>

        </View>
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  updatebtn: {
    width: "100%",
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.blue,
    borderRadius: 8 
  },
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    top: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    alignItems: "left",
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    paddingVertical: 10,
    color: "#fff"
    // fontWeight: 'bold',
    // textAlign: 'center',
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
  },
  editIconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  imageContainer: {
    width: "100%",
    height: "200",
    alignItems: "center",
    justifyContent: "center",
  },
  btnSwitch: {
    gap: 15,
  },
  helpAboutSection: {
    marginBottom: 10,
    gap: 15,
  },
  sectionTitle: {
    marginVertical: 10,
  },
  sectionTitleText: {
    fontSize: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
    textAlign: "left",
  },
  sectionText: {
    fontSize: 16,
  },
  AboutSection: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: "center",
  },
  helpAbout: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalContainerHelp: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 30,
    paddingLeft: 10,
    paddingRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingTop: 30,
    paddingLeft: 10,
    paddingRight: 10,
  },
  modalContent: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "justify",
  },
  closeButton: {
    paddingVertical: 7,
    paddingHorizontal: 20,
    backgroundColor: "#339FFF",
    borderRadius: 5,
    alignItems: "center",
  },
  titleHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  featureItem: {
    marginBottom: 24,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 16,
    color: "#555",
  },
});
