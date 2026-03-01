/**
 * Action Button Component
 * Button for actions like "Upcoming Class" and "Current Class"
 */
import React from "react";
import {
  Text,
  StyleSheet,
  Pressable,
  Animated,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Typography, Spacing, BorderRadius, Shadows } from "../../theme";

interface ActionButtonProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: "primary" | "secondary";
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  icon,
  onPress,
  variant = "primary",
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

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

  const isPrimary = variant === "primary";

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], flex: 1 }}>
      <Pressable
        style={[
          styles.button,
          isPrimary ? styles.primaryButton : styles.secondaryButton,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Ionicons
          name={icon}
          size={16}
          color={isPrimary ? Colors.black : Colors.white}
        />
        <Text style={[styles.text, { color: isPrimary ? Colors.black : Colors.white }]}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  primaryButton: {
    backgroundColor: Colors.white,
  },
  secondaryButton: {
    backgroundColor: Colors.backgroundTertiary,
    borderWidth: 1,
    borderColor: Colors.textMuted,
  },
  text: {
    ...Typography.buttonSmall,
  },
});
