import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';

const resumes = [
	{ 
		field: "Data Scientist Resume", 
		url: require("../assets/Resumes/DataScientist.png"),
		screen: "https://enhancv.com/resume-examples/data-scientist/"
	},
	{ 
		field: "Entry Level Software Engineer Resume",  
		url: require("../assets/Resumes/EntrySoftware.png"),
		screen: "https://enhancv.com/resume-examples/entry-level-software-engineer/"
	},
	{ 
		field: "Entry Level Web Development Resume", 
		url: require("../assets/Resumes/EntryWeb.png"), 
		screen: "https://enhancv.com/resume-examples/web-developer/"
	},
	{ 
		field: "Business Analyst Resume", 
		url: require("../assets/Resumes/BusinessAnalyst.png"), 
		screen: "https://enhancv.com/resume-examples/business-analyst/"
	},
	{ 
		field: "Digital Marketing Resume", 
		url: require("../assets/Resumes/DigitalMarketing.png"), 
		screen: "https://enhancv.com/resume-examples/digital-marketing/"
	},
	{ 
		field: "UX Designer Resume", 
		url: require("../assets/Resumes/UXDesigner.png"), 
		screen: "https://enhancv.com/resume-examples/ux-designer/"
	},
	{ 
		field: "Front-End Developer Resume", 
		url: require("../assets/Resumes/Frontend.png"), 
		screen: "https://enhancv.com/resume-examples/front-end-developer/"
	},
	{ 
		field: "Python Developer Resume", 
		url: require("../assets/Resumes/Py.png"), 
		screen: "https://enhancv.com/resume-examples/python-developer/"
	},
	
];

const openURL = (screen) => {
    Linking.openURL(screen).catch((err) => console.error('An error occurred', err));
};

const Resume = () => {

	return (
		<View style={styles.container}>
			<FlatList
				data={resumes}
				keyExtractor={(item) => item.field}
                showsVerticalScrollIndicator={false}
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
    container: {
		flex: 1,
		justifyContent: 'center',
		padding: 20,
	},
	testItem: {
		marginVertical: 10,
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
		fontSize: 18,
        fontWeight: 'bold'
	},
	image: {
		width: "100%",
		height: 480,
		borderRadius: 10,
	},
});

export default Resume;

export { resumes };