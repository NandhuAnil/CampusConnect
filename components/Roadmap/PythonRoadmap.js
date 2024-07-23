import React, { useEffect, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TouchableOpacity,
	Animated,
	Linking,
} from "react-native";
import COLORS from "../../constants/colors";

const roadmap = [
	{ 
		field: "Basic", 
		url: "https://www.w3schools.com/python/", 
		color: "red", 
		description: "Syntax, basic data types, control structures" 
	},
	{ 
		field: "Intermediate", 
		url: "https://realpython.com/", 
		color: "green", 
		description: "Object-oriented programming, error handling, modules" 
	},
	{ 
		field: "Advanced", 
		url: "https://docs.python.org/3/tutorial/index.html", 
		color: "blue", 
		description: "Decorators, generators, context managers" 
	},
	{ 
		field: "Data Science", 
		url: "https://www.datacamp.com/courses/tech:python", 
		color: "orange", 
		description: "NumPy, pandas, data visualization, statistics" 
	},
	{ 
		field: "Machine Learning", 
		url: "https://www.coursera.org/learn/machine-learning", 
		color: "purple", 
		description: "Supervised learning, unsupervised learning, neural networks" 
	},
	{ 
		field: "Web Development", 
		url: "https://flask.palletsprojects.com/en/2.0.x/", 
		color: "brown", 
		description: "Flask framework, routing, templates, databases" 
	},
	{ 
		field: "Automation", 
		url: "https://automatetheboringstuff.com/", 
		color: "indigo", 
		description: "Automating tasks, web scraping, working with files" 
	},
	{ 
		field: "DevOps", 
		url: "https://www.udacity.com/course/cloud-dev-ops-nanodegree--nd9991", 
		color: "#05a831", 
		description: "CI/CD pipelines, infrastructure as code, Docker, Kubernetes" 
	},
	{ 
		field: "Cyber Security", 
		url: "https://www.cybrary.it/catalog/python/", 
		color: "#d1026a", 
		description: "Penetration testing, network security, cryptography" 
	},
];


const openURL = (url) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
};

const PythonRoadmap = () => {
	const progress = useRef(new Animated.Value(0)).current;
	const circleScales = useRef(roadmap.map(() => ({ scale: new Animated.Value(1), bounced: false }))).current;

	useEffect(() => {
		Animated.timing(progress, {
			toValue: 1,
			duration: 9000,
			useNativeDriver: false,
		}).start();
	}, []);

	useEffect(() => {
		progress.addListener(({ value }) => {
			roadmap.forEach((_, index) => {
				if (value >= index / roadmap.length && !circleScales[index].bounced) {
					circleScales[index].bounced = true;
					Animated.spring(circleScales[index].scale, {
						toValue: 1.5,
						friction: 2,
						tension: 160,
						useNativeDriver: false,
					}).start(() => {
						Animated.spring(circleScales[index].scale, {
							toValue: 1,
							friction: 2,
							tension: 160,
							useNativeDriver: false,
						}).start();
					});
				}
			});
		});
	}, [progress]);
	

	const animatedHeight = progress.interpolate({
		inputRange: [0, 1],
		outputRange: ["0%", "100%"],
	});

	const renderItem = ({ item, index }) => {
		const isLeftAligned = index % 2 === 0;

		return (
			<View style={styles.timelineItem}>
				{isLeftAligned && (
					<TouchableOpacity style={[styles.content, styles.leftContent]} onPress={() => openURL(item.url)}>
						<View>
							<Text style={[styles.fieldText, { color: item.color }]}>{item.field}</Text>
							<Text style={[styles.descriptionText, { color: item.color }]}>{item.description}</Text>
						</View>
					</TouchableOpacity>
				)}
				<View style={styles.circleContainer}>
					<Animated.View style={[styles.circle, { backgroundColor: item.color, transform: [{ scale: circleScales[index].scale }] }]} />
				</View>
				{!isLeftAligned && (
					<TouchableOpacity style={[styles.content, styles.rightContent]} onPress={() => openURL(item.url)}>
						<Text style={[styles.fieldText, { color: item.color }]}>{item.field}</Text>
						<Text style={[styles.descriptionText, { color: item.color }]}>{item.description}</Text>
					</TouchableOpacity>
				)}
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<View style={styles.timeline}>
				<View style={styles.verticalLine} />
				<Animated.View style={[styles.animatedLine, { height: animatedHeight }]} />
				<FlatList
					data={roadmap}
					showsVerticalScrollIndicator={false}
					keyExtractor={(item) => item.field}
					renderItem={renderItem}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 40,
		paddingBottom: 20,
		paddingHorizontal: 20,
	},
	timeline: {
		position: "relative",
	},
	verticalLine: {
		position: "absolute",
		backgroundColor: COLORS.black,
		width: 5,
		height: "100%",
		left: "50%",
		marginLeft: -2,
		zIndex: -1,
	},
	animatedLine: {
		position: "absolute",
		backgroundColor: COLORS.primary,
		width: 5,
		left: "50%",
		marginLeft: -2,
		zIndex: -1,
	},
	timelineItem: {
		position: "relative",
		marginBottom: 20,
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	circleContainer: {
		width: 40,
		height: 40,
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		left: "50%",
		marginLeft: -20,
		zIndex: 1,
	},
	circle: {
		width: 20,
		height: 20,
		borderRadius: 20,
		backgroundColor: "gray",
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		width: "40%",
		padding: 10,
        backgroundColor: COLORS.white,
		borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
	},
	leftContent: {
		alignItems: "flex-end",
		marginRight: 180,
	},
	rightContent: {
		alignItems: "flex-start",
		marginLeft: 180,
	},
	fieldText: {
		color: "black",
		fontWeight: "bold",
        fontSize: 16,
	},
	descriptionText: {
		fontSize: 12,
	},
});

export default PythonRoadmap;
