import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, ToastAndroid, RefreshControl, Linking } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import useNotes from '../Hooks/useNotes';

const Notes = () => {
  const { filteredNotes, loading, fetchNotes, handleSearch } = useNotes();
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotes();
    setRefreshing(false);
  };

  const handleView = async (url) => {
    try {
      Linking.openURL(url); 
    } catch (error) {
      console.error('Error opening file:', error);
      ToastAndroid.show('Could not open file', ToastAndroid.SHORT);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.noteContainer}>
      <View style={styles.noteInfo}>
        <Text style={styles.noteTitle}>{item.subject}</Text>
        <Text style={styles.noteDetails}>Department: {item.department}</Text>
        <Text style={styles.noteDetails}>Semester: {item.semester}</Text>
        <Text style={styles.noteDetails}>Units: {item.units}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => handleView(item.downloadURL)} style={styles.shareButton}>
          <Ionicons name="eye" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: "#ffffff", flexDirection: "row", padding: 10, justifyContent: "space-between", borderRadius: 5, margin: 10 }}>
        <TextInput
          placeholder="Search here.."
          style={{ width: "80%" }}
          value={searchTerm}
          onChangeText={text => {
            setSearchTerm(text);
            handleSearch(text);
          }}
        />
        <TouchableOpacity>
          <AntDesign name="search1" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredNotes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No data found</Text>}
      />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.white,
  },
  searchBar: {
    height: 40,
    borderColor: COLORS.grey,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  noteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    backgroundColor: COLORS.white,
    marginBottom: 10,
    borderBottomWidth: 0.5,
    margin: 10,
  },
  noteInfo: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noteDetails: {
    fontSize: 14,
    marginBottom: 3,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
});

export default Notes;

// export { filteredNotes };
