import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import Button from "../components/Button";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'; 

const Signup = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isPasswordShown1, setIsPasswordShown1] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [userRole, setUserRole] = useState(null); 
  const [isVerified, setIsVerified] = useState(false); 
  const [verificationInput, setVerificationInput] = useState(''); 
  const [verificationData, setVerificationData] = useState(''); 
  const [adminverificationData, setAdminVerificationData] = useState(''); 

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  function handleChange(text, eventName) {
    setValues((prev) => {
      return {
        ...prev,
        [eventName]: text,
      };
    });
  }

  async function SignUp() {
    const { name, email, password, password2 } = values;
  
    if (!isVerified) {
      ToastAndroid.show('Please verify your role first', ToastAndroid.SHORT);
      return;
    }
  
    if (password === password2) {
      try {
        const userCredential = await auth().createUserWithEmailAndPassword(
          email,
          password
        );
        const user = userCredential.user;
  
        // Store user details in Firestore with retry logic
        await firestore().collection('users').doc(user.uid).set({
            uid: user.uid,
            name: name,
            email: email,
            role: userRole,
            phoneNumber: "",
            photoURL: "",
            timestamp: new Date(),
          })
        
        ToastAndroid.show("User registered successfully", ToastAndroid.SHORT);
      } catch (error) {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show("Passwords do not match!", ToastAndroid.SHORT);
    }
  }
  
  useEffect(() => {
    // Fetch verification data from Firestore
    const fetchData = async () => {
      try {
        const Userdoc = await firestore().collection('verificationData').doc('enrollNumbers').get();
        const Admindoc = await firestore().collection('verificationData').doc('securityKey').get();
        if (Userdoc.exists && Admindoc.exists) {
          setVerificationData(Userdoc.data());
          setAdminVerificationData(Admindoc.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };
  
    fetchData();
  }, []);
  
  

  const verifyInput = () => {
    if (!verificationData || !adminverificationData) {
      ToastAndroid.show('Verification data not loaded', ToastAndroid.SHORT);
      return;
    }
  
    const { enrollNumbers } = verificationData;
    const securityKey = adminverificationData.key;  // Extract key from the admin verification data
  
    if (verificationInput === securityKey) {
      setUserRole('admin');
      setIsVerified(true);
      ToastAndroid.show('Admin verified successfully', ToastAndroid.SHORT);
    } else {
      const matchedEnroll = enrollNumbers.find(enroll => enroll.number === verificationInput);
      if (matchedEnroll) {
        setUserRole('user');
        setIsVerified(true);
        setValues((prev) => ({
          ...prev,
          name: matchedEnroll.username,
        }));
        ToastAndroid.show('User verified successfully', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Invalid key or enrollment number', ToastAndroid.SHORT);
        setIsVerified(false);
      }
    }
  };
  
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView style={{ flex: 1, marginHorizontal: 22 }} showsVerticalScrollIndicator={false}>

        <View style={{ marginVertical: 22 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginVertical: 12,
              color: COLORS.black,
            }}
          >
            Create Account
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: COLORS.black,
            }}
          >
            Connect with your Academic friend today!
          </Text>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 2,
            }}
          >
            Security Key / Enroll Number
          </Text>
          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: "center",
              justifyContent: "space-between",
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <TextInput
              placeholder="Enter security key or enroll number"
              placeholderTextColor={COLORS.black}
              style={{
                width: "80%",
              }}
              value={verificationInput}
              onChangeText={setVerificationInput}
            />
            <TouchableOpacity onPress={verifyInput} style={{ padding: 5 }}>
              <Text style={{ color: "#196ffa", fontSize: 16}} >Verify</Text>
            </TouchableOpacity>
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
            Name
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
              placeholder="Enter your name"
              placeholderTextColor={COLORS.black}
              style={{
                width: "100%",
              }}
              onChangeText={(text) => handleChange(text, "name")}
              value={values.name}
              editable={isVerified}
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
            Email address
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
              placeholder="Enter your email address"
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
              style={{
                width: "100%",
              }}
              onChangeText={(text) => handleChange(text, "email")}
              autoCapitalize="none"
              editable={isVerified}
            />
          </View>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
            }}
          >
            Password
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
              placeholder="Enter your password"
              placeholderTextColor={COLORS.black}
              secureTextEntry={!isPasswordShown}
              style={{
                width: "100%",
              }}
              onChangeText={(text) => handleChange(text, "password")}
              editable={isVerified}
            />

            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={{
                position: "absolute",
                right: 12,
              }}
            >
              {isPasswordShown ? (
                <Ionicons name="eye-off" size={24} color={COLORS.black} />
              ) : (
                <Ionicons name="eye" size={24} color={COLORS.black} />
              )}
            </TouchableOpacity>
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
            Confirm Password
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
              placeholder="Enter your confirm password"
              placeholderTextColor={COLORS.black}
              secureTextEntry={!isPasswordShown1}
              style={{
                width: "100%",
              }}
              onChangeText={(text) => handleChange(text, "password2")}
              editable={isVerified}
            />

            <TouchableOpacity
              onPress={() => setIsPasswordShown1(!isPasswordShown1)}
              style={{
                position: "absolute",
                right: 12,
              }}
            >
              {isPasswordShown1 ? (
                <Ionicons name="eye-off" size={24} color={COLORS.black} />
              ) : (
                <Ionicons name="eye" size={24} color={COLORS.black} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginVertical: 6,
          }}
        >
          <Checkbox
            style={{ marginRight: 8 }}
            value={isChecked}
            onValueChange={setIsChecked}
            color={isChecked ? COLORS.primary : undefined}
            disabled={!isVerified}
          />

          <Text>I agree to the terms and conditions</Text>
        </View>

        <Button
          title="Sign Up"
          filled
          style={{
            marginTop: 18,
            marginBottom: 4,
          }}
          onPress={() => SignUp()}
          disabled={!isVerified}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 20,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: COLORS.grey,
              marginHorizontal: 10,
            }}
          />
          <Text style={{ fontSize: 14 }}>Or Sign up with</Text>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: COLORS.grey,
              marginHorizontal: 10,
            }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => console.log("Pressed")}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              height: 52,
              borderWidth: 1,
              borderColor: COLORS.grey,
              marginRight: 4,
              borderRadius: 10,
            }}
          >
            <Image
              source={require("../assets/Icon/facebook.png")}
              style={{
                height: 36,
                width: 36,
                marginRight: 8,
              }}
              resizeMode="contain"
            />

            <Text>Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => console.log("Pressed")}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              height: 52,
              borderWidth: 1,
              borderColor: COLORS.grey,
              marginRight: 4,
              borderRadius: 10,
            }}
          >
            <Image
              source={require("../assets/Icon/google.png")}
              style={{
                height: 36,
                width: 36,
                marginRight: 8,
              }}
              resizeMode="contain"
            />

            <Text>Google</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: 22,
          }}
        >
          <Text style={{ fontSize: 16, color: COLORS.black }}>
            Already have an account
          </Text>
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text
              style={{
                fontSize: 16,
                color: COLORS.primary,
                fontWeight: "bold",
                marginLeft: 6,
              }}
            >
              Login
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
