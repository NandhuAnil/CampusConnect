import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function ImageViewer({
  placeholderImageSource,
  selectedImage,
  effect,
  onPress,
}) {
  const imageSource = selectedImage
    ? { uri: selectedImage }
    : { uri: placeholderImageSource };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={imageSource} style={styles.image} />
      {effect && <View style={[styles.overlay, effect]} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 100, 
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
