import React from "react";
import COLORS from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Dashboard from "./Dashboard";
import Notes from "./Notes";
import Feedback from "./Feedback";
import Setting from "./Setting";
import Admin from "./Admin";

import Notify from "../example";

import Question from "../components/Quiz/Question";
import TestsList from "../components/Quiz/TestsList";
import Leaderboard from "../components/Quiz/Leaderboard";
import CreateTest from "../components/Quiz/CreateTest";
import ViewAnnouncement from "../components/Anouncement/ViewAnnouncement"
import CreateAnnouncement from "../components/Anouncement/CreateAnnouncement"
import UploadNote from "../components/UploadNote"
import PythonRoadmap from "../components/Roadmap/PythonRoadmap";
import JavaRoadmap from "../components/Roadmap/JavaRoadmap";
import WebdevRoadmap from '../components/Roadmap/WebdevRoadmap';
import StackdevRoadmap from '../components/Roadmap/StackdevRoadmap';
import Roadmap from "../components/Roadmap/Roadmap";
import Resume from "../components/Resume";

import Welcome from '../components/WelcomeOnbroad/Welcome';

import useUserDetails from '../Hooks/UserDetails';

import NotificationComponent from "../Utils/NotificationComponent";
import VerificationData from "../Utils/VerificationData";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function Home () {

  const { role } =  useUserDetails();

    return (
      <Stack.Navigator
        screenOptions={{
          statusBarColor: COLORS.primary,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: "#fff",
        }}
      >
        <Stack.Screen
          name="Main"
          options={{ headerShown: false }}
        >
          {props => <MainTabs {...props} role={role} />} 
        </Stack.Screen>
        <Stack.Screen
          name="TestsList"
          component={TestsList}
          options={{ 
            headerShown: true,
            headerTitle: "Quiz", 
          }}
        />
        <Stack.Screen
          name="PythonRoadmap"
          component={PythonRoadmap}
          options={{ 
            headerShown: true,
            headerTitle: "Python Roadmap", 
          }}
        />
        <Stack.Screen
          name="JavaRoadmap"
          component={JavaRoadmap}
          options={{ 
            headerShown: true,
            headerTitle: "Java Roadmap", 
          }}
        />
        <Stack.Screen
          name="WebdevRoadmap"
          component={WebdevRoadmap}
          options={{ 
            headerShown: true,
            headerTitle: "Web Roadmap", 
          }}
        />
        <Stack.Screen
          name="StackdevRoadmap"
          component={StackdevRoadmap}
          options={{ 
            headerShown: true,
            headerTitle: "Full Stack Roadmap", 
          }}
        />
        <Stack.Screen
          name="Roadmap"
          component={Roadmap}
          options={{ 
            headerShown: true,
            headerTitle: "Roadmap", 
          }}
        />
        <Stack.Screen
          name="Resume"
          component={Resume}
          options={{ 
            headerShown: true,
            headerTitle: "Resume", 
          }}
        />
        <Stack.Screen
          name="NotificationComponent"
          component={NotificationComponent}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Question"
          component={Question}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateAnnouncement"
          component={CreateAnnouncement}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="ViewAnnouncement"
          component={ViewAnnouncement}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Leaderboard"
          component={Leaderboard}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateTest"
          component={CreateTest}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="UploadNote"
          component={UploadNote}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Notify"
          component={Notify}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="VerificationData"
          component={VerificationData}
          options={{ headerShown: true, headerTitle: "Add Students", }}
        />
      </Stack.Navigator>
    );
}

const MainTabs = ({ role }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "Dashboard") {
          iconName = focused ? "home" : "home-outline";
        } else if (route.name === "Notes") {
          iconName = focused ? "document-text" : "document-text-outline";
        } else if (route.name === "Feedbacks") {
          iconName = focused ? "chatbox" : "chatbox-outline";
        } else if (route.name === "Settings") {
          iconName = focused ? "settings" : "settings-outline";
        } else if (route.name === "Add") {
          iconName = focused ? "add-circle" : "add-circle-outline";
          size=30
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.black,
      headerStyle: {
        backgroundColor: COLORS.primary,
      },
      headerTintColor: "#fff",
    })}
  >
    <Tab.Screen
      name="Dashboard"
      component={Dashboard}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Notes"
      component={Notes}
      options={{
        headerShown: true,
        headerTitle: "Study materials",
      }}
    />
     {role === "admin" && (
      <Tab.Screen
        name="Add"
        component={Admin}
        options={{
          tabBarLabel: "Add",
          // tabBarIcon: ({ focused, color, size }) => (
          //   <Ionicons name="add-circle" size={40} color={COLORS.primary} />
          // ),
        }}
      />
    )}
    <Tab.Screen
      name="Feedbacks"
      component={Feedback}
      options={{
        headerShown: true,
        headerTitle: "Feedback",
      }}
    />
    <Tab.Screen
      name="Settings"
      component={Setting}
      options={{
        headerShown: true,
        headerTitle: "Settings and activity",
      }}
    />
  </Tab.Navigator>
);

