import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import COLORS from '../constants/colors';
import { resumes } from '../components/Resume';

const openURL = (screen) => {
    Linking.openURL(screen).catch((err) => console.error('An error occurred', err));
};

const HorizontalResume = () => {

	return (
		<View style={styles.container}>
            <Text style={styles.header}>Resume templates</Text>
			<FlatList
				data={resumes}
				keyExtractor={(item) => item.field}
                horizontal
                showsHorizontalScrollIndicator={false}
				renderItem={({ item }) => (
				<TouchableOpacity style={styles.testItem} onPress={() => openURL(item.screen)}>
					<Image source={item.url} style={styles.image} />
					<View style={styles.testDetails}>
						<Text style={styles.testName}>{item.field}</Text>
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
	testItem: {
        width: 200,
		marginHorizontal: 10,
		padding: 10,
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 10,
		backgroundColor: '#fff',
	},
	testDetails: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
		marginTop: 10,
	},
	testName: {
		fontSize: 15,
	},
	image: {
		width: 170,
		height: 250,
		borderRadius: 10,
	},
});

export default HorizontalResume;