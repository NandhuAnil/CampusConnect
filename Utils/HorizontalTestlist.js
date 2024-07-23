import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../constants/colors';
import useFetchTests from '../Hooks/useFetchTests';

  
const HorizontalTestlist = () => {
  const { tests, loading } = useFetchTests();
  const navigation = useNavigation();
  
  const handleTestPress = (testId) => {
    navigation.navigate('TestsList', { testId });
  };

  return (
    <>
    {!loading ? (
    <View>
      <Text style={styles.header}>Available Tests</Text>
      <FlatList
        data={tests}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.testItem} onPress={() => handleTestPress(item.id)}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.testName}>{item.name}</Text>
            <Text style={styles.testDuration}>Duration: {item.duration} seconds</Text>
          </TouchableOpacity>
        )}
      />
    </View>
    ) : null }
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    marginBottom: 10,
    marginTop: 10,
    color: COLORS.white,
  },
  testItem: {
    marginHorizontal: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 100,
    borderRadius: 10,
  },
  testName: {
    fontSize: 18,
    marginTop: 10,
  },
  testDuration: {
    fontSize: 14,
  },
});

export default HorizontalTestlist