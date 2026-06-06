import React from "react";
import { Text, StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

interface Props {
  title: string;
  image: string;
  onPress: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const OptionCard: React.FC<Props> = ({ title, image, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchable
      style={[styles.container, animatedStyle]}
      onPressIn={() => (scale.value = withSpring(0.9))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={onPress}
    >
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    marginVertical: 12,
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 24,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,

    elevation: 8,

    minHeight: 160,
  },

  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 14,
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    letterSpacing: 0.4,
  },
});

export default OptionCard;