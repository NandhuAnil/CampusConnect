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

const stackDevRoadmap = [
	{ 
		field: "Frontend Development", 
		url: "https://developer.mozilla.org/en-US/docs/Learn/Front-end_web_developer", 
		color: "red", 
		description: "HTML, CSS, JavaScript, frameworks like React, Angular, Vue" 
	},
	{ 
		field: "Backend Development", 
		url: "https://developer.mozilla.org/en-US/docs/Learn/Server-side", 
		color: "green", 
		description: "Server-side languages (Node.js, Python, Java), RESTful APIs" 
	},
	{ 
		field: "Databases", 
		url: "https://www.mongodb.com/what-is-mongodb", 
		color: "blue", 
		description: "SQL (PostgreSQL, MySQL), NoSQL (MongoDB, Firebase)" 
	},
	{ 
		field: "Version Control", 
		url: "https://git-scm.com/doc", 
		color: "brown", 
		description: "Git, branching, merging, version management, GitHub" 
	},
	{ 
		field: "CI/CD", 
		url: "https://www.atlassian.com/continuous-delivery", 
		color: "orange", 
		description: "Continuous Integration/Continuous Deployment, Jenkins, Travis CI" 
	},
	{ 
		field: "Containerization & Orchestration", 
		url: "https://docs.docker.com/get-started/", 
		color: "purple", 
		description: "Docker, Kubernetes, container management, orchestration" 
	},
	{ 
		field: "Cloud Services", 
		url: "https://aws.amazon.com/getting-started/", 
		color: "#05a831", 
		description: "AWS, Azure, Google Cloud Platform, cloud architecture" 
	},
	{ 
		field: "Testing", 
		url: "https://www.selenium.dev/documentation/en/", 
		color: "indigo", 
		description: "Unit testing, integration testing, automated testing, Selenium" 
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

const StackdevRoadmap = () => {
    const progress = useRef(new Animated.Value(0)).current;
    const circleScales = useRef(stackDevRoadmap.map(() => ({ scale: new Animated.Value(1), bounced: false }))).current;

	useEffect(() => {
		Animated.timing(progress, {
			toValue: 1,
			duration: 9000,
			useNativeDriver: false,
		}).start();
	}, []);

    useEffect(() => {
		progress.addListener(({ value }) => {
			stackDevRoadmap.forEach((_, index) => {
				if (value >= index / stackDevRoadmap.length && !circleScales[index].bounced) {
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
					data={stackDevRoadmap}
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



export default StackdevRoadmap