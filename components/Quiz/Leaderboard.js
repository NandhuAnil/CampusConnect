import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { LinearGradient } from "expo-linear-gradient";
import COLORS from '../../constants/colors';
import { FontAwesome5, AntDesign  } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Leaderboard = () => {
  const navigation = useNavigation();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const scoresRef = firestore().collection('scores');
        const querySnapshot = await scoresRef.orderBy('score', 'desc').get();
        const leaderboardData = [];
        querySnapshot.forEach((doc) => {
          leaderboardData.push({ id: doc.id, ...doc.data() });
        });
        setLeaderboard(leaderboardData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard: ', error);
      }
    };
  
    fetchLeaderboard();
  }, []);
  

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#39B68D" />
      </View>
    );
  }

  const topOne = leaderboard.slice(0, 1);
  const topTwo = leaderboard.slice(1, 2);
  const topThree = leaderboard.slice(2, 3);

  return (
    <LinearGradient
        style={{ flex: 1, padding: 20 }}
        colors={[COLORS.third, COLORS.primary, COLORS.secondary]}
      >
        <View style={{ flexDirection: 'row' ,gap: 10}}>
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <AntDesign name="arrowleft" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={{ color: COLORS.white, fontSize: 22, marginBottom: 20, marginLeft: 10 }}>Leaderboard</Text>
        </View>
      {topOne.map((item, index) => (
        <View key={item.id} style={styles.Container}>
          <View style={styles.topperContainer}>
            <View style={styles.topOne}>
              <Image
                source={item.photoURL ? { uri: item.photoURL } : { uri: generateAvatarUrl(item.name)}}
                style={styles.profileStyleTopper}
              />
            </View>
          </View>
          <Text style={{ fontSize: 17, color: COLORS.white }}>{item.name}</Text>
          <View style={styles.ellipse}><Text>{index + 1}th</Text></View>
          {index === 0 && <View style={styles.ellipse1}><FontAwesome5 name="chess-queen" size={18} color="#E6CF01" /></View>}
        </View>
      ))}
      <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 10}}>
      {topTwo.map((item, index) => (
          <View key={item.id} style={styles.Container}>
            <View style={styles.topperContainer}>
              <View style={styles.topOne1}>
                <Image
                  source={item.photoURL ? { uri: item.photoURL } : { uri: generateAvatarUrl(item.name)}}
                  style={styles.profileStyleTopper}
                />
              </View>
            </View>
            <Text style={{ fontSize: 16, color: COLORS.white }}>{item.name}</Text>
            <View style={styles.ellipse2}><Text>2th</Text></View>
          </View>
        ))}
       {topThree.map((item, index) => (
          <View key={item.id} style={styles.Container}>
            <View style={styles.topperContainer}>
              <View style={styles.topOne3}>
                <Image
                  source={item.photoURL ? { uri: item.photoURL } : { uri: generateAvatarUrl(item.name)}}
                  style={styles.profileStyleTopper}
                />
              </View>
            </View>
            <Text style={{ fontSize: 16, color: COLORS.white }}>{item.name}</Text>
            <View style={styles.ellipse3}><Text>3th</Text></View>
          </View>
        ))}
      </View>
      <View style={styles.listDesign}>
        <FlatList
          data={leaderboard}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.leaderboardItem}>
              <View style={{ flexDirection: 'row', gap: 15, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.leaderboardRank}>{index + 1}th</Text>
                <Image
                  source={item.photoURL ? { uri: item.photoURL } : { uri: generateAvatarUrl(item.name)}}
                  style={styles.profileStyle}
                />
                <Text style={styles.leaderboardUsername}>{item.name}</Text>
              </View>
              <Text style={styles.leaderboardScore}>{item.score}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20, color: COLORS.white }}>No data found</Text>}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View style={styles.rectangle}></View>
      <View style={styles.rectangle1}></View>
      <View style={styles.rectangle2}></View> 
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,
  },
  profileStyle: {
    width: 30,
    height: 30,
    borderRadius: 100,
  },
  profileStyleTopper: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  topperContainer: {
    width: "100%",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ellipse: {
    width: 25,
    height: 25,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    position: 'absolute',
    left: "35%",
    top: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ellipse2: {
    width: 25,
    height: 25,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    position: 'absolute',
    left: "2%",
    top: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ellipse3: {
    width: 25,
    height: 25,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    position: 'absolute',
    left: "-2%",
    top: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ellipse1: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    position: 'absolute',
    left: "56%",
    top: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topOne: {
    width: 90,
    height: 90,
    borderRadius: 50,
    borderColor: '#E6CF01',
    borderWidth: 3,
  },
  topOne1: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderColor: '#E6CF01',
    borderWidth: 3,
  },
  topOne3: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderColor: '#E6CF01',
    borderWidth: 3,
  },
  rectangle: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 22,
    top: -30,
    left: 282,
    backgroundColor: "#D9D9D91C",
  },
  rectangle1: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 22,
    top: 190,
    left: -97,
    backgroundColor: "#D9D9D91C",
  },
  rectangle2: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 22,
    top: 470,
    left: 292,
    backgroundColor: "#D9D9D91C",
  },
  listDesign: {
    position: 'absolute',
    width: 342,
    height: 572,
    left: 10,
    top: '45%',
    backgroundColor: "#00000069",
    borderRadius: 40,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginBottom: 10,
    width: '100%',
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D91C"
  },
  leaderboardRank: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  leaderboardUsername: {
    fontSize: 18,
    marginRight: 10,
    color: COLORS.white,
  },
  leaderboardScore: {
    fontSize: 18,
    marginRight: 10,
    color: COLORS.white,
  },
  leaderboardTime: {
    fontSize: 18,
  },
});

export default Leaderboard;

