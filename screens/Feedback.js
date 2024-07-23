import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar, Send } from "react-native-gifted-chat";
import firestore from '@react-native-firebase/firestore';

import COLORS from "../constants/colors";
import { FontAwesome } from "@expo/vector-icons";
import useUserDetails from "../Hooks/UserDetails";
import { useSendNotification } from '../Hooks/useSendNotification';

const Feedback = () => {
  const { Timestamp } = firestore;
  const { name, photoURL } = useUserDetails();
  const { sendNotifications } = useSendNotification();
  const [messages, setMessages] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [replyingToMessage, setReplyingToMessage] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const q = firestore().collection('feedbacks').orderBy('timestamp', 'desc');
      const unsubscribe = q.onSnapshot((snapshot) => {
        const messagesList = snapshot.docs.map((doc) => {
          const firebaseData = doc.data();
          const firstLetter = firebaseData.name ? firebaseData.name.charAt(0) : '';
          const data = {
            _id: doc.id,
            text: firebaseData.message,
            createdAt: firebaseData.timestamp.toDate(),
            user: {
              _id: firebaseData.name,
              name: firebaseData.name,
              avatar: firebaseData.photoURL || `https://ui-avatars.com/api/?background=0dbc3f&color=FFF&name=${firstLetter}`,
            },
            replyTo: firebaseData.replyTo,
          };
          return data;
        });
        setMessages(messagesList);
      });
  
      return () => unsubscribe();
    };
  
    fetchFeedbacks();
  }, []);
  
  const handleSendFeedback = async (newMessages = []) => {
    const newMessage = newMessages[0];
    const messageData = {
      name: newMessage.user._id,
      message: newMessage.text,
      photoURL: photoURL || null,
      timestamp: Timestamp.fromDate(newMessage.createdAt),
      replyTo: replyTo,
      replyingToMessage: replyingToMessage,
    };
  
    try {
      await firestore().collection('feedbacks').add(messageData);
      await sendNotifications('Feedback Received', `New Feedback from ${newMessage.user.name}`);
      setReplyTo(null);
      setReplyingToMessage(null);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
  const handleLongPress = (context, message) => {
    setReplyTo(message._id);
    setReplyingToMessage(message.text);
  };

  const renderBubble = (props) => {
    return (
      <View>     
        <Bubble
          {...props}
          onLongPress={(context, message) => handleLongPress(context, message)}
          wrapperStyle={{
            right: {
              backgroundColor: COLORS.primary,
            },
            left: {
              backgroundColor: COLORS.white,
            },
          }}
          textStyle={{
            left: {
              color: COLORS.black,
              fontSize: 16,
            },
          }}
        />
      </View>
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: "#E8E8E8",
          borderRadius: 15,
        }}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={styles.sendButton}>
          <FontAwesome name="send" size={22} color="#196ffa" />
        </View>
      </Send>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/backgroundimg.jpg")}
      style={styles.container}
    >
      <View style={{ flex: 1 }}>
        {replyingToMessage && (
          <View style={styles.replyContainer}>
            <Text style={styles.replyText1}><Text style={{ color: COLORS.black }}>Reply :</Text>  {replyingToMessage}</Text>
            <TouchableOpacity
              onPress={() => {
                setReplyingToMessage(null);
                setReplyTo(null);
              }}
            >
              <FontAwesome name="close" size={18} color="#000" />
            </TouchableOpacity>
          </View>
        )}
        <GiftedChat
          messages={messages}
          onSend={(messages) => handleSendFeedback(messages)}
          user={{
            _id: name,
            name: name,
            avatar: photoURL,
          }}
          renderBubble={renderBubble}
          alwaysShowSend
          renderUsernameOnMessage 
          scrollToBottom 
          renderInputToolbar={renderInputToolbar}
          renderSend={renderSend}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    resizeMode: "cover",
  },
  inputToolbar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    marginRight: 15,
    marginBottom: 10,
  },
  replyContainer: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cancelReply: {
    color: "red",
  },
  replyWrapper: {
    backgroundColor: COLORS.primary,
    padding: 5,
    borderRadius: 5,
    marginBottom: 5,
  },
  replyText: {
    color: COLORS.white,
    fontStyle: "italic",
    fontSize: 12,
  },
  replyText1: {
    color: COLORS.primary,
    fontStyle: "italic",
    fontSize: 12,
  },
});

export default Feedback;
