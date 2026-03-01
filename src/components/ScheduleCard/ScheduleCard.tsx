/**
 * Schedule Card Component
 * Displays a single schedule item with all details - Modern Black UI
 */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Schedule } from "../../types";
import { Colors, Typography, Spacing, BorderRadius } from "../../theme";

interface ScheduleCardProps {
  schedule: Schedule;
  onPress?: () => void;
  onDelete?: () => void;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  onPress,
  onDelete,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
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

  const timeLabel = `${schedule.startTime} - ${schedule.endTime}`;

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Header Row - Time, Room */}
        <View style={styles.headerRow}>
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={16} color={Colors.white} />
            <Text style={styles.timeText}>{timeLabel}</Text>
          </View>
          <View style={styles.roomContainer}>
            <Ionicons name="location-outline" size={16} color={Colors.white} />
            <Text style={styles.roomText}>{schedule.room}</Text>
          </View>
        </View>

        {/* Course Code & Teacher - Horizontal Row */}
        <View style={styles.infoStack}>
          <View style={styles.infoRow}>
            <Ionicons name="code-outline" size={14} color="#888" />
            <Text style={styles.subjectCode}>{schedule.subjectCode}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={14} color="#888" />
            <Text style={styles.teacherName}>{schedule.teacherName}</Text>
          </View>
        </View>

        {/* Subject Name - Below */}
        <View style={styles.nameRow}>
          <Ionicons name="book-outline" size={18} color={Colors.white} />
          <Text style={styles.subjectName}>{schedule.subjectName}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  timeText: {
    ...Typography.body,
    color: Colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  roomContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  roomText: {
    ...Typography.body,
    color: Colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  infoStack: {
    flexDirection: "row",
    marginBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  subjectCode: {
    ...Typography.bodySmall,
    color: "#999",
    fontSize: 13,
  },
  teacherName: {
    ...Typography.bodySmall,
    color: "#999",
    fontSize: 13,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  subjectName: {
    ...Typography.h3,
    color: Colors.white,
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
  },
});
