import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [lastSearchTerm, setLastSearchTerm] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLastSearchTerm = async () => {
      const term = await AsyncStorage.getItem('lastSearchTerm');
      if (term) {
        setLastSearchTerm(term);
      }
    };
    fetchLastSearchTerm();
  }, []);

  const predefinedList = [
    { field: 'Python Roadmap', screen: 'PythonRoadmap' },
    { field: 'Java Roadmap', screen: 'JavaRoadmap' },
    { field: 'Web Development Roadmap', screen: 'WebdevRoadmap' },
    { field: 'Stack Based Development', screen: 'StackdevRoadmap' },
    // Add more suggestions as needed
  ];

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term) {
      const filteredSuggestions = predefinedList.filter(item =>
        item.field.toLowerCase().includes(term.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }

    await AsyncStorage.setItem('lastSearchTerm', term);
  };

  const handleSearchIconPress = () => {
    const selectedItem = predefinedList.find(item => item.field.toLowerCase() === searchTerm.toLowerCase());
    if (selectedItem) {
      handleSuggestionSelect(selectedItem);
    } else {
      console.log('No matching item found');
    }
  };
  

  const handleSuggestionSelect = (item) => {
    setSearchTerm(item.field);
    setSuggestions([]);
    navigation.navigate(item.screen);
  };

  return {
    searchTerm,
    setSearchTerm: handleSearch,
    suggestions,
    lastSearchTerm,
    handleSuggestionSelect,
    handleSearchIconPress,
  };
};

export default useSearch;
