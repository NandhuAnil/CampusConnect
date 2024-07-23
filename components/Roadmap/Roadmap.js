import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const roadmap = [
	{ 
		field: "Python Roadmap", 
		color: "red", 
		description: "Syntax, basic data types, control structures, object-oriented programming, modules, data science, machine learning, web development, automation, DevOps, cybersecurity",
		url: require("../../assets/Roadmap/python.jpg"),
		screen: "PythonRoadmap"
	},
	{ 
		field: "Java Roadmap",  
		color: "green", 
		description: "Syntax, basic data types, control structures, object-oriented programming, collections, error handling, multithreading, Java I/O, web development, enterprise applications, mobile development, DevOps, testing, cybersecurity",
		url: require("../../assets/Roadmap/java.jpg"),
		screen: "JavaRoadmap"
	},
	{ 
		field: "Web Development Roadmap",  
		color: "blue",
		description: "HTML basics, CSS styling, responsive design, JavaScript syntax, DOM manipulation, ES6 features, version control, front-end frameworks, back-end development, databases, DevOps, testing, security",
		url: require("../../assets/Roadmap/Web.jpg"), 
		screen: "WebdevRoadmap"
	},
	{ 
		field: "Stack Based Development",  
		color: "orange", 
		description: "Frontend development (HTML, CSS, JavaScript, frameworks), backend development (Node.js, Python, Java, RESTful APIs), databases (SQL, NoSQL), version control (Git), CI/CD, containerization & orchestration (Docker, Kubernetes), cloud services, testing, security",
		url: require("../../assets/Roadmap/stack.jpg"), 
		screen: "StackdevRoadmap"
	}
];

const Timeline = () => {
	const navigation = useNavigation();

	return (
		<View style={styles.container}>
			<FlatList
				data={roadmap}
				keyExtractor={(item) => item.field}
				showsVerticalScrollIndicator={false}
				renderItem={({ item }) => (
				<TouchableOpacity style={styles.testItem} onPress={() => navigation.navigate(item.screen)}>
					<Image source={item.url} style={styles.image} />
					<View style={styles.testDetails}>
						<Text style={styles.testName}>{item.field}</Text>
					</View>
					<Text style={styles.para}>{item.description}</Text>
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
	},
	image: {
		width: "100%",
		height: 150,
		borderRadius: 10,
	},
	para: {
		textAlign: 'justify',
		fontSize: 12,
	},
});

export default Timeline;

export { roadmap };