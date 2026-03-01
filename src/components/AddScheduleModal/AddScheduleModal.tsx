/**
 * Add/Edit Schedule Modal Component
 * Modal for adding a new schedule or editing an existing one
 */
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Schedule, ScheduleInput } from "../../types";
import { Colors, Typography, Spacing, BorderRadius, Layout } from "../../theme";

interface AddScheduleModalProps {
  visible: boolean;
  schedule?: Schedule | null;
  day: string;
  onSave: (data: ScheduleInput, id?: string) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

interface FormData {
  startTime: string;
  endTime: string;
  room: string;
  subjectCode: string;
  subjectName: string;
  teacherName: string;
}

const initialFormData: FormData = {
  startTime: "",
  endTime: "",
  room: "",
  subjectCode: "",
  subjectName: "",
  teacherName: "",
};

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  visible,
  schedule,
  day,
  onSave,
  onCancel,
  onDelete,
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  // Reset form when modal opens/closes or schedule changes
  useEffect(() => {
    if (visible) {
      if (schedule) {
        setFormData({
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          room: schedule.room,
          subjectCode: schedule.subjectCode,
          subjectName: schedule.subjectName,
          teacherName: schedule.teacherName,
        });
      } else {
        setFormData(initialFormData);
      }
      
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
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
    }
  }, [visible, schedule]);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Basic validation - only time, room, and subject name are required
    if (!formData.startTime || !formData.endTime || !formData.room || !formData.subjectName) {
      return;
    }

    const input: ScheduleInput = {
      day,
      ...formData,
    };

    onSave(input, schedule?.id);
  };

  const isEditing = !!schedule;

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
          <Animated.View
            style={[
              styles.container,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            {/* Header - Fixed */}
            <View style={styles.header}>
              <View style={styles.headerTitleContainer}>
                <View style={styles.headerIcon}>
                  <Ionicons
                    name={isEditing ? "create" : "add-circle"}
                    size={24}
                    color={Colors.black}
                  />
                </View>
                <Text style={styles.title}>
                  {isEditing ? "Edit Schedule" : "Add New Schedule"}
                </Text>
              </View>
            </View>

            {/* Day Badge */}
            <View style={styles.dayBadge}>
              <Ionicons name="calendar" size={16} color={Colors.black} />
              <Text style={styles.dayBadgeText}>{day}</Text>
            </View>

            {/* Scrollable Input Section */}
            <ScrollView
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Time Row */}
              <View style={styles.timeRow}>
                <View style={styles.timeInputContainer}>
                  <Text style={styles.inputLabel}>Start Time</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="time-outline" size={20} color={Colors.black} />
                    <TextInput
                      style={styles.input}
                      value={formData.startTime}
                      onChangeText={(v) => updateField("startTime", v)}
                      placeholder="10:00 AM"
                      placeholderTextColor={Colors.textPlaceholder}
                    />
                  </View>
                </View>
                
                <View style={styles.timeSeparator}>
                  <Text style={styles.timeSeparatorText}>–</Text>
                </View>
                
                <View style={styles.timeInputContainer}>
                  <Text style={styles.inputLabel}>End Time</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="time-outline" size={20} color={Colors.black} />
                    <TextInput
                      style={styles.input}
                      value={formData.endTime}
                      onChangeText={(v) => updateField("endTime", v)}
                      placeholder="11:00 AM"
                      placeholderTextColor={Colors.textPlaceholder}
                    />
                  </View>
                </View>
              </View>

              {/* Room No */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Room No</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="location-outline" size={20} color={Colors.black} />
                  <TextInput
                    style={styles.input}
                    value={formData.room}
                    onChangeText={(v) => updateField("room", v)}
                    placeholder="E-313"
                    placeholderTextColor={Colors.textPlaceholder}
                  />
                </View>
              </View>

              {/* Subject Code */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Subject Code <Text style={styles.optionalText}>(Optional)</Text></Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="code-outline" size={20} color={Colors.black} />
                  <TextInput
                    style={styles.input}
                    value={formData.subjectCode}
                    onChangeText={(v) => updateField("subjectCode", v)}
                    placeholder="23CP307T"
                    placeholderTextColor={Colors.textPlaceholder}
                    autoCapitalize="characters"
                  />
                </View>
              </View>

              {/* Subject Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Subject Name</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="book-outline" size={20} color={Colors.black} />
                  <TextInput
                    style={styles.input}
                    value={formData.subjectName}
                    onChangeText={(v) => updateField("subjectName", v)}
                    placeholder="AI"
                    placeholderTextColor={Colors.textPlaceholder}
                  />
                </View>
              </View>

              {/* Teacher Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Teacher Name <Text style={styles.optionalText}>(Optional)</Text></Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color={Colors.black} />
                  <TextInput
                    style={styles.input}
                    value={formData.teacherName}
                    onChangeText={(v) => updateField("teacherName", v)}
                    placeholder="Trishna Paul"
                    placeholderTextColor={Colors.textPlaceholder}
                  />
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons - Fixed */}
            <View style={styles.buttonRow}>
              {isEditing && onDelete && (
                <Pressable style={styles.deleteButton} onPress={onDelete}>
                  <Ionicons name="trash-outline" size={20} color={Colors.white} />
                </Pressable>
              )}
              <Pressable style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={handleSave}>
                <Ionicons name="checkmark" size={20} color={Colors.black} />
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: Colors.modalBackground,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  container: {
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: BorderRadius.xxl,
    width: "100%",
    maxWidth: 400,
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  dayBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  dayBadgeText: {
    ...Typography.label,
    color: Colors.black,
  },
  scrollContainer: {
    flexGrow: 0,
    flexShrink: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Spacing.sm,
  },
  timeInputContainer: {
    flex: 1,
  },
  timeSeparator: {
    paddingBottom: Spacing.md,
  },
  timeSeparatorText: {
    ...Typography.h3,
    color: Colors.textMuted,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  inputLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  optionalText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontStyle: "italic",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: Layout.inputHeight,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.black,
    height: "100%",
  },
  buttonRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  deleteButton: {
    width: 48,
    backgroundColor: "#E74C3C",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.buttonCancel,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  cancelButtonText: {
    ...Typography.button,
    color: Colors.textPrimary,
  },
  saveButtonText: {
    ...Typography.button,
    color: Colors.black,
  },
});
