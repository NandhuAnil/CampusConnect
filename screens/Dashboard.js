import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import COLORS from "../constants/colors";
import { AntDesign } from '@expo/vector-icons';

import Header from "../components/Header";
import HorizontalTestlist from "../Utils/HorizontalTestlist";
import HorizontalRoadmap from "../Utils/HorizontalRoadmap";
import HorizontalResume from "../Utils/HorizontalResume";
import HorizontalFileList from "../Utils/HorizontalFileList";
import useUserDetails from "../Hooks/UserDetails";
import useNotes from "../Hooks/useNotes";
import useFetchTests from "../Hooks/useFetchTests";

const Dashboard = ({ navigation }) => {
  const { tests } = useFetchTests();
  const { name, photoURL } = useUserDetails();
  const { filteredNotes } = useNotes();
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
    <ScrollView showsVerticalScrollIndicator={false}>
      <LinearGradient
        style={{ height: 300, padding: 20 }}
        colors={[COLORS.primary, COLORS.secondary]}
      >
          <View style={styles.header}>
            <View style={{ flexDirection: "row" }}>
              <Image
                source={photoURL ? { uri: photoURL } : { uri: generateAvatarUrl(name)}}
                style={styles.profileStyle}
              />
              <View style={{ paddingLeft: 10, paddingTop: 5 }}>
                <Text style={{ color: "white" }}>Welcome</Text>
                <Text style={{ fontSize: 16, color: "white" }}>{name}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("NotificationComponent")}>
              <AntDesign name="message1" size={24} color="white" style={{ top: 10 }} />
            </TouchableOpacity>
          </View>
          <Header navigation={navigation} />
        
      </LinearGradient>
      <View style={{ top: -100, padding: 20 }}>
      {tests.length > 0 ? (
        <HorizontalTestlist />
      ) : null}
        <HorizontalRoadmap />
        <HorizontalResume />
      {filteredNotes.length > 0 ? (
        <HorizontalFileList />
      ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileStyle: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  skeletonContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default Dashboard;
