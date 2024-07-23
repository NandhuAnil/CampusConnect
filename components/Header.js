import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import useSearch from '../Hooks/useSearch';

const Header = ({ navigation }) => {
  const { searchTerm, setSearchTerm, suggestions, handleSuggestionSelect, handleSearchIconPress } = useSearch();

  return (
    <View>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search here.."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />
        <TouchableOpacity onPress={handleSearchIconPress}>
          <AntDesign name="search1" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.field}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => handleSuggestionSelect(item)}
            >
              <Text>{item.field}</Text>
            </TouchableOpacity>
          )}

        />
      )}
      <View style={styles.navigationContainer}>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.navigate('TestsList')}
          >
            <Image source={require('../assets/Icon/Exam.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.iconText}>Exam</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.navigate('ViewAnnouncement')}
          >
            <Image source={require('../assets/Icon/Annoncement.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.iconText}>Circular</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.navigate('Resume')}
          >
            <Image source={require('../assets/Icon/Resume.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.iconText}>Resumes</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.navigate('Roadmap')}
          >
            <Image source={require('../assets/Icon/Roadmap.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.iconText}>Road map</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 10,
    marginTop: 20,
    justifyContent: 'space-between',
    borderRadius: 5,
  },
  searchInput: {
    width: '80%',
  },
  suggestionItem: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
    gap: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 35,
    height: 35, 
  },
  iconText: {
    color: '#fff',
    margin: 2,
    fontSize: 12,
  },
});

export default Header;
