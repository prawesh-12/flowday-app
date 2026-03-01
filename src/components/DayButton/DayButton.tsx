/**
 * Day Button Component
 * Button for selecting a day of the week
 */
import React from "react";
import {
  Text,
  StyleSheet,
  Pressable,
  Animated,
  useWindowDimensions,
} from "react-native";
import { Colors, Typography, Spacing, BorderRadius, Shadows } from "../../theme";

interface DayButtonProps {
  day: string;
  onPress: () => void;
}

export const DayButton: React.FC<DayButtonProps> = ({ day, onPress }) => {
  const { width } = useWindowDimensions();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  // Responsive button width - 2 buttons per row with gap
  const buttonWidth = (width - Spacing.xl * 2 - Spacing.md) / 2;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: buttonWidth }}>
      <Pressable
        style={styles.button}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text style={styles.text}>{day}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.backgroundTertiary,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  text: {
    ...Typography.bodyLarge,
    color: Colors.textPrimary,
  },
});
