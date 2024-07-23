import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import COLORS from "../constants/colors";
import { useNavigation } from '@react-navigation/native';
import useNotes from '../Hooks/useNotes';

const HorizontalFileList = () => {
    const navigation = useNavigation();
    const { filteredNotes } = useNotes();
    
    const handleFilePress = (fileId) => {
        navigation.navigate('Notes', { fileId });
    };

    return (
        <View>
            <Text style={styles.header}>Study materials</Text>
            <FlatList
                data={filteredNotes}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleFilePress(item.id)}>
                        <View style={styles.fileContainer}>
                            <View style={styles.iconStyle} >
                                <FontAwesome6 name="file-pdf" size={70} color={COLORS.blue} />
                            </View>
                            <Text style={styles.fileName}>{item.subject}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        marginBottom: 10,
        marginTop: 10,
        color: COLORS.black,
    },
    fileContainer: {
        flexDirection:'column',
        marginHorizontal: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        width: 220,
        height: 150,
    },
    iconStyle: {
        width: "100%",
        height: 100,
        backgroundColor: '#d',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fileName: {
        marginTop: 10,
        fontSize: 16,
    },
    skeletonContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    skeletonItem: {
        marginHorizontal: 5,
    },
});

export default HorizontalFileList;
