import React from "react";
import { Dimensions } from "react-native";
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import COLORS from "../constants/colors";
const { width, height } = Dimensions.get('window');

const SkeletonLoader = (props) => {
  return (
    <>
    <LinearGradient
      style={{ height: 300, padding: 20, paddingTop: 40 }}
      colors={[COLORS.primary, COLORS.secondary]}
    >
    <ContentLoader
      speed={.5}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      backgroundColor="#ffffff"
      foregroundColor="#434544"
      {...props}
    >
      <Rect x="58" y="8" rx="4" ry="4" width="54" height="6" />
      <Rect x="58" y="26" rx="3" ry="3" width="185" height="10" />
      <Rect x="2" y="70" rx="3" ry="3" width="320" height="50" />
      <Circle cx="25" cy="25" r="25" />
      <Circle cx="308" cy="25" r="15" />
      <Rect x="10" y="140" rx="8" ry="8" width="50" height="50" />
      <Rect x="90" y="140" rx="8" ry="8" width="50" height="50" />
      <Rect x="170" y="140" rx="8" ry="8" width="50" height="50" />
      <Rect x="250" y="140" rx="8" ry="8" width="50" height="50" />
      </ContentLoader>
      </LinearGradient>
      <View style={{ top: -290, padding:20 }}>
      <ContentLoader
        speed={.5}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        backgroundColor="#ffffff"
        foregroundColor="#434544"
        {...props}
      >
      <Rect x="2" y="220" rx="3" ry="3" width="185" height="20" />
      <View style={styles.skeletonContainer}>
        <View style={styles.skeletonItem}>
          <Rect x="15" y="260" rx="10" ry="10" width="210" height="157" />
          <Rect x="25" y="265" rx="10" ry="10" width="190" height="90" />
          <Rect x="25" y="360" rx="3" ry="3" width="119" height="20" />
          <Rect x="25" y="390" rx="4" ry="4" width="190" height="9" />
        </View>
        <View style={styles.skeletonItem}>
          <Rect x="250" y="260" rx="10" ry="10" width="210" height="157" />
          <Rect x="260" y="265" rx="10" ry="10" width="190" height="90" />
          <Rect x="260" y="360" rx="3" ry="3" width="119" height="20" />
          <Rect x="260" y="390" rx="4" ry="4" width="190" height="9" />
        </View>
      </View>

      <Rect x="2" y="440" rx="3" ry="3" width="185" height="20" />
      <View style={styles.skeletonContainer}>
        <View style={styles.skeletonItem}>
          <Rect x="15" y="480" rx="10" ry="10" width="210" height="157" />
          <Rect x="25" y="485" rx="10" ry="10" width="190" height="90" />
          <Rect x="25" y="580" rx="3" ry="3" width="119" height="20" />
          <Rect x="25" y="610" rx="4" ry="4" width="190" height="9" />
        </View>
        <View style={styles.skeletonItem}>
          <Rect x="250" y="480" rx="10" ry="10" width="210" height="157" />
          <Rect x="260" y="485" rx="10" ry="10" width="190" height="90" />
          <Rect x="260" y="580" rx="3" ry="3" width="119" height="20" />
          <Rect x="260" y="610" rx="4" ry="4" width="190" height="9" />
        </View>
      </View>

      <Rect x="2" y="660" rx="3" ry="3" width="185" height="20" />
      <View style={styles.skeletonContainer}>
        <View style={styles.skeletonItem}>
          <Rect x="15" y="700" rx="10" ry="10" width="210" height="157" />
          <Rect x="25" y="705" rx="10" ry="10" width="190" height="90" />
          <Rect x="25" y="800" rx="3" ry="3" width="119" height="20" />
          <Rect x="25" y="830" rx="4" ry="4" width="190" height="9" />
        </View>
        <View style={styles.skeletonItem}>
          <Rect x="250" y="700" rx="10" ry="10" width="210" height="157" />
          <Rect x="260" y="705" rx="10" ry="10" width="190" height="90" />
          <Rect x="260" y="800" rx="3" ry="3" width="119" height="20" />
          <Rect x="260" y="830" rx="4" ry="4" width="190" height="9" />
        </View>
      </View>
      </ContentLoader>
      </View>
      </>
  );
};

export default SkeletonLoader;

const styles = StyleSheet.create({
  skeletonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  skeletonItem: {
      marginHorizontal: 5,
  },
});
