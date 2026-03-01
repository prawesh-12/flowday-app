/**
 * Delete Confirmation Modal
 * Shows a confirmation dialog before deleting a schedule
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
import { Colors, Typography, Spacing, BorderRadius } from "../../theme";

interface DeleteModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  visible,
  onConfirm,
  onCancel,
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

  return (
    <Modal transparent animationType="none" visible={visible}>
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <Animated.View
          style={[
            styles.container,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="warning" size={48} color={Colors.error} />
          </View>
          
          <Text style={styles.title}>Delete Schedule?</Text>
          <Text style={styles.message}>
            Are you sure you want to delete this schedule? This action cannot be undone.
          </Text>

          <View style={styles.buttonRow}>
            <Pressable style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>No</Text>
            </Pressable>
            <Pressable style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmText}>Yes</Text>
            </Pressable>
          </View>
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
    maxWidth: 340,
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.xxl,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: "row",
    gap: Spacing.md,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.buttonCancel,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: Colors.error,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  cancelText: {
    ...Typography.button,
    color: Colors.textPrimary,
  },
  confirmText: {
    ...Typography.button,
    color: Colors.white,
  },
});
