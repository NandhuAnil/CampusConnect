import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import React from 'react';
import COLORS from '../constants/colors';
import { MaterialIcons } from "@expo/vector-icons";

const Admin = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => navigation.navigate("UploadNote")}
        style={styles.buttonDesign}
      >
        <View style={styles.iconDesign}>
          <Image source={require("../assets/Icon/upload.png")} style={{ width: 30, height: 30 }} />
          <Text
            style={[
              styles.sectionText,
              { color: "#000" },
              { paddingTop: 3 },
            ]}
          >
            Upload Notes
          </Text>
        </View>
        <View style={styles.iconDesign}>
          <MaterialIcons
            name="arrow-right"
            size={26}
            color={"black"}
            style={{ alignItems: "center" }}
          />
        </View>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate("CreateAnnouncement")}
        style={styles.buttonDesign}
      >
        <View style={styles.iconDesign}>
          <Image source={require("../assets/Icon/Annoncement.png")} style={{ width: 30, height: 30 }} />
          <Text
            style={[
              styles.sectionText,
              { color: "#000" },
              { paddingTop: 3 },
            ]}
          >
            Upload Circular
          </Text>
        </View>
        <View style={styles.iconDesign}>
          <MaterialIcons
            name="arrow-right"
            size={26}
            color={"black"}
            style={{ alignItems: "center" }}
          />
        </View>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate("CreateTest")}
        style={styles.buttonDesign}
      >
        <View style={styles.iconDesign}>
          <Image source={require("../assets/Icon/Exam.png")} style={{ width: 30, height: 30 }} />
          <Text
            style={[
              styles.sectionText,
              { color: "#000" },
              { paddingTop: 3 },
            ]}
          >
            Create Quiz
          </Text>
        </View>
        <View style={styles.iconDesign}>
          <MaterialIcons
            name="arrow-right"
            size={26}
            color={"black"}
            style={{ alignItems: "center" }}
          />
        </View>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate("VerificationData")}
        style={styles.buttonDesign}
      >
        <View style={styles.iconDesign}>
          <Image source={require("../assets/Icon/users.png")} style={{ width: 30, height: 30 }} />
          <Text
            style={[
              styles.sectionText,
              { color: "#000" },
              { paddingTop: 3 },
            ]}
          >
            Add Student
          </Text>
        </View>
        <View style={styles.iconDesign}>
          <MaterialIcons
            name="arrow-right"
            size={26}
            color={"black"}
            style={{ alignItems: "center" }}
          />
        </View>
      </Pressable>   
      <Pressable
        onPress={() => navigation.navigate("Notify")}
        style={styles.buttonDesign}
      >
        <View style={styles.iconDesign}>
          <Image source={require("../assets/Icon/bell.png")} style={{ width: 30, height: 30 }} />
          <Text
            style={[
              styles.sectionText,
              { color: "#000" },
              { paddingTop: 3 },
            ]}
          >
           Notification
          </Text>
        </View>
        <View style={styles.iconDesign}>
          <MaterialIcons
            name="arrow-right"
            size={26}
            color={"black"}
            style={{ alignItems: "center" }}
          />
        </View>
      </Pressable>   
      <Pressable
        onPress={() => navigation.navigate("Welcome")}
        style={styles.buttonDesign}
      >
        <View style={styles.iconDesign}>
          <Image source={require("../assets/Icon/bell.png")} style={{ width: 30, height: 30 }} />
          <Text
            style={[
              styles.sectionText,
              { color: "#000" },
              { paddingTop: 3 },
            ]}
          >
           OnboardingScreen
          </Text>
        </View>
        <View style={styles.iconDesign}>
          <MaterialIcons
            name="arrow-right"
            size={26}
            color={"black"}
            style={{ alignItems: "center" }}
          />
        </View>
      </Pressable>   
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
  },
  buttonDesign: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  iconDesign: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: "center",
  },
  sectionText: {
    fontSize: 16,
    marginBottom: 5,
  },
})

export default Admin