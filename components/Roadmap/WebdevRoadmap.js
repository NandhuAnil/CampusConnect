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

const webDevRoadmap = [
	{ 
		field: "HTML & CSS", 
		url: "https://www.w3schools.com/html/", 
		color: "red", 
		description: "HTML basics, CSS styling, responsive design" 
	},
	{ 
		field: "JavaScript", 
		url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", 
		color: "green", 
		description: "JavaScript syntax, DOM manipulation, ES6 features" 
	},
	{ 
		field: "Version Control", 
		url: "https://www.git-scm.com/doc", 
		color: "blue", 
		description: "Git basics, branching, merging, GitHub" 
	},
	{ 
		field: "Front-End Frameworks", 
		url: "https://reactjs.org/docs/getting-started.html", 
		color: "brown", 
		description: "React, Vue.js, Angular, component-based architecture" 
	},
	{ 
		field: "Back-End Development", 
		url: "https://expressjs.com/en/starter/installing.html", 
		color: "orange", 
		description: "Node.js, Express, RESTful APIs, server-side scripting" 
	},
	{ 
		field: "Databases", 
		url: "https://www.mongodb.com/what-is-mongodb", 
		color: "purple", 
		description: "SQL, NoSQL, MongoDB, PostgreSQL" 
	},
	{ 
		field: "DevOps", 
		url: "https://www.udemy.com/course/devops-projects/", 
		color: "#05a831", 
		description: "CI/CD pipelines, Docker, Kubernetes, cloud services" 
	},
	{ 
		field: "Testing", 
		url: "https://www.selenium.dev/documentation/en/", 
		color: "indigo", 
		description: "Unit testing, integration testing, Selenium, Jest" 
	},
	{ 
		field: "Security", 
		url: "https://owasp.org/www-project-top-ten/", 
		color: "#d1026a", 
		description: "Web security fundamentals, OWASP Top Ten, secure coding" 
	},
];

const openURL = (url) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
};

const WebdevRoadmap = () => {
    const progress = useRef(new Animated.Value(0)).current;
    const circleScales = useRef(webDevRoadmap.map(() => ({ scale: new Animated.Value(1), bounced: false }))).current;

	useEffect(() => {
		Animated.timing(progress, {
			toValue: 1,
			duration: 9000,
			useNativeDriver: false,
		}).start();
	}, []);

    useEffect(() => {
		progress.addListener(({ value }) => {
			webDevRoadmap.forEach((_, index) => {
				if (value >= index / webDevRoadmap.length && !circleScales[index].bounced) {
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
					data={webDevRoadmap}
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


export default WebdevRoadmap