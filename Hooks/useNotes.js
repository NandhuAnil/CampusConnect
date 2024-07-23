import { useState, useEffect } from 'react';
import { firebase } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const useNotes = () => {
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [notesData, setNotesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const notesCollection = firebase.firestore().collection('notes');
    const querySnapshot = await notesCollection.get();
    const notesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const filePromises = notesList.map(async (note) => {
      const downloadURL = await storage().ref(`documents/${note.fileName}`).getDownloadURL();
      return { ...note, downloadURL };
    });

    const notesWithURLs = await Promise.all(filePromises);
    setNotesData(notesWithURLs);
    setFilteredNotes(notesWithURLs);
    setLoading(false);
  };

  const handleSearch = (text) => {
    const filteredData = notesData.filter(item =>
      item.subject.toLowerCase().includes(text.toLowerCase()) ||
      item.department.toLowerCase().includes(text.toLowerCase()) ||
      item.semester.toLowerCase().includes(text.toLowerCase()) ||
      item.units.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredNotes(filteredData);
  };

  return { filteredNotes, setFilteredNotes, notesData, loading, fetchNotes, handleSearch, uploadSuccess, setUploadSuccess, };
};

export default useNotes;
