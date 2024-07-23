import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import COLORS from "../constants/colors";
import { useNavigation } from '@react-navigation/native';
import { roadmap } from '../components/Roadmap/Roadmap';

const Timeline = () => {
	const navigation = useNavigation();

	return (
		<View>
			<Text style={styles.header}>Road Maps</Text>
			<FlatList
				data={roadmap}
				keyExtractor={(item) => item.field}
				horizontal
                showsHorizontalScrollIndicator={false}
				renderItem={({ item }) => (
				<TouchableOpacity style={styles.testItem} onPress={() => navigation.navigate(item.screen)}>
					<Image source={item.url} style={styles.image} />
					<View style={styles.testDetails}>
						<Text style={styles.testName}>{item.field}</Text>
					</View>
					{/* <Text style={styles.para}>{item.description}</Text> */}
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
		fontSize: 16,
	},
	image: {
		width: 200,
		height: 100,
		borderRadius: 10,
	},
	para: {
		textAlign: 'justify',
		fontSize: 12,
	},
});

export default Timeline;