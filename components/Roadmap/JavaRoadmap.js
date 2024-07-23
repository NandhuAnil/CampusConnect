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

const javaRoadmap = [
	{ 
		field: "Basic", 
		url: "https://www.w3schools.com/java/", 
		color: "red", 
		description: "Syntax, basic data types, control structures" 
	},
	{ 
		field: "Intermediate", 
		url: "https://www.javatpoint.com/java-tutorial", 
		color: "green", 
		description: "Object-oriented programming, collections, error handling" 
	},
	{ 
		field: "Advanced", 
		url: "https://docs.oracle.com/javase/tutorial/", 
		color: "blue", 
		description: "Multithreading, concurrency, Java I/O, streams" 
	},
	{ 
		field: "Web Development", 
		url: "https://spring.io/guides", 
		color: "brown", 
		description: "Spring framework, REST APIs, MVC architecture" 
	},
	{ 
		field: "Enterprise Applications", 
		url: "https://www.baeldung.com/cs/java-enterprise-edition", 
		color: "orange", 
		description: "Java EE, EJB, JMS, JPA" 
	},
	{ 
		field: "Mobile Development", 
		url: "https://developer.android.com/training/basics/firstapp", 
		color: "purple", 
		description: "Android development, activities, fragments, UI design" 
	},
	{ 
		field: "DevOps", 
		url: "https://www.udemy.com/course/devops-projects/", 
		color: "#05a831", 
		description: "CI/CD pipelines, Jenkins, Docker, Kubernetes" 
	},
	{ 
		field: "Testing", 
		url: "https://www.guru99.com/software-testing.html", 
		color: "indigo", 
		description: "JUnit, TestNG, Selenium, automated testing" 
	},
	{ 
		field: "Cyber Security", 
		url: "https://www.cybrary.it/catalog/java/", 
		color: "#d1026a", 
		description: "Secure coding, encryption, network security" 
	},
];

const openURL = (url) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
};

const JavaRoadmap = () => {
    const progress = useRef(new Animated.Value(0)).current;
    const circleScales = useRef(javaRoadmap.map(() => ({ scale: new Animated.Value(1), bounced: false }))).current;

	useEffect(() => {
		Animated.timing(progress, {
			toValue: 1,
			duration: 9000,
			useNativeDriver: false,
		}).start();
	}, []);

    useEffect(() => {
		progress.addListener(({ value }) => {
			javaRoadmap.forEach((_, index) => {
				if (value >= index / javaRoadmap.length && !circleScales[index].bounced) {
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
					data={javaRoadmap}
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

export default JavaRoadmap