/**
 * Class Info Modal Component
 * Shows current or upcoming class information as a popup
 */
import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Schedule } from "../../types";
import { Colors, Typography, Spacing, BorderRadius } from "../../theme";

interface ClassInfoModalProps {
  visible: boolean;
  type: "current" | "upcoming";
  schedule: Schedule | null;
  onClose: () => void;
}

export const ClassInfoModal: React.FC<ClassInfoModalProps> = ({
  visible,
  type,
  schedule,
  onClose,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  const isCurrent = type === "current";
  const title = isCurrent ? "Current Class" : "Upcoming Class";
  const icon = isCurrent ? "time" : "calendar";

  return (
    <Modal transparent animationType="none" visible={visible}>
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <Animated.View
          style={[
            styles.container,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name={icon} size={32} color={Colors.black} />
            </View>
            <Text style={styles.title}>{title}</Text>
          </View>

          {/* Content */}
          {schedule ? (
            <View style={styles.content}>
              {/* Row 1: Time & Day */}
              <View style={styles.infoGrid}>
                <View style={[styles.infoBox, { flex: 1.3 }]}>
                  <View style={styles.infoLabel}>
                    <Ionicons name="time-outline" size={16} color={Colors.textMuted} />
                    <Text style={styles.labelText}>Time</Text>
                  </View>
                  <Text style={styles.infoValue} numberOfLines={1}>
                    {schedule.startTime} - {schedule.endTime}
                  </Text>
                </View>
                <View style={[styles.infoBox, { flex: 0.7 }]}>
                  <View style={styles.infoLabel}>
                    <Ionicons name="calendar-outline" size={16} color={Colors.textMuted} />
                    <Text style={styles.labelText}>Day</Text>
                  </View>
                  <Text style={styles.infoValue}>{schedule.day}</Text>
                </View>
              </View>

              {/* Row 2: Room & Subject Code */}
              <View style={styles.infoGrid}>
                <View style={styles.infoBox}>
                  <View style={styles.infoLabel}>
                    <Ionicons name="location-outline" size={16} color={Colors.textMuted} />
                    <Text style={styles.labelText}>Room</Text>
                  </View>
                  <Text style={styles.infoValue}>{schedule.room}</Text>
                </View>
                <View style={styles.infoBox}>
                  <View style={styles.infoLabel}>
                    <Ionicons name="code-outline" size={16} color={Colors.textMuted} />
                    <Text style={styles.labelText}>Code</Text>
                  </View>
                  <Text style={styles.infoValue}>{schedule.subjectCode || "-"}</Text>
                </View>
              </View>

              {/* Row 3: Subject Name & Teacher */}
              <View style={styles.infoGrid}>
                <View style={styles.infoBox}>
                  <View style={styles.infoLabel}>
                    <Ionicons name="book-outline" size={16} color={Colors.textMuted} />
                    <Text style={styles.labelText}>Subject</Text>
                  </View>
                  <Text style={styles.infoValue}>{schedule.subjectName}</Text>
                </View>
                <View style={styles.infoBox}>
                  <View style={styles.infoLabel}>
                    <Ionicons name="person-outline" size={16} color={Colors.textMuted} />
                    <Text style={styles.labelText}>Teacher</Text>
                  </View>
                  <Text style={styles.infoValue}>{schedule.teacherName || "-"}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.emptyContent}>
              <Ionicons name="school-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>
                {isCurrent
                  ? "No class is currently in session"
                  : "No upcoming class for today"}
              </Text>
            </View>
          )}

          {/* Close Button */}
          <Pressable style={styles.okButton} onPress={onClose}>
            <Text style={styles.okButtonText}>OK</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.modalBackground,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  container: {
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    width: "100%",
    maxWidth: 380,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
    flex: 1,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  content: {
    gap: Spacing.sm,
  },
  infoGrid: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  infoBox: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  infoLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  labelText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
  },
  infoValue: {
    ...Typography.body,
    color: Colors.black,
    fontWeight: "700",
    fontSize: 13,
    flexShrink: 1,
  },
  emptyContent: {
    alignItems: "center",
    paddingVertical: Spacing.xxxl,
    gap: Spacing.lg,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: "center",
  },
  okButton: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    marginTop: Spacing.xl,
  },
  okButtonText: {
    ...Typography.button,
    color: Colors.black,
  },
});
