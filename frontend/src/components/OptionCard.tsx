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
    backgroundColor: "#fff",
    marginVertical: 12,
    padding: 15,
    borderRadius: 18,
    alignItems: "center",
    elevation: 5,
  },
  image: {
    width: 70,
    height: 70,
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
  },
});

export default OptionCard;