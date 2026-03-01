/**
 * Day Schedule Screen
 * Shows all schedules for a specific day with add, edit, and delete functionality
 */
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Animated,
  useWindowDimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  ScheduleCard,
  AddScheduleModal,
  DeleteModal,
} from "../../src/components";
import { Schedule, ScheduleInput } from "../../src/types";
import { scheduleDao } from "../../src/db";
import { Colors, Typography, Spacing, BorderRadius } from "../../src/theme";

export default function DayScheduleScreen() {
  const { day } = useLocalSearchParams<{ day: string }>();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [deletingSchedule, setDeletingSchedule] = useState<Schedule | null>(null);

  // Animation
  const headerAnim = React.useRef(new Animated.Value(1)).current;

  // Load schedules
  const loadSchedules = useCallback(() => {
    if (day) {
      setLoading(true);
      // Small delay to ensure smooth transition
      setTimeout(() => {
        const data = scheduleDao.getByDay(day);
        setSchedules(data);
        setLoading(false);
      }, 50);
    }
  }, [day]);

  useFocusEffect(
    useCallback(() => {
      // Reset state on focus to prevent stale content
      setSchedules([]);
      setLoading(true);
      loadSchedules();

      return () => {
        // Cleanup on blur
      };
    }, [loadSchedules])
  );

  // Handle save (add or edit)
  const handleSave = (input: ScheduleInput, id?: string) => {
    if (id) {
      // Update existing schedule
      const updated: Schedule = {
        id,
        day: input.day,
        startTime: input.startTime,
        endTime: input.endTime,
        startMinutes: 0, // Will be calculated in DAO
        endMinutes: 0,
        room: input.room,
        subjectCode: input.subjectCode,
        subjectName: input.subjectName,
        teacherName: input.teacherName,
      };
      scheduleDao.update(updated);
    } else {
      // Insert new schedule
      scheduleDao.insert({
        day: input.day,
        startTime: input.startTime,
        endTime: input.endTime,
        room: input.room,
        subjectCode: input.subjectCode,
        subjectName: input.subjectName,
        teacherName: input.teacherName,
      });
    }

    setShowAddModal(false);
    setEditingSchedule(null);
    loadSchedules();
  };

  // Handle delete
  const handleDelete = () => {
    if (deletingSchedule) {
      scheduleDao.delete(deletingSchedule.id);
      setDeletingSchedule(null);
      loadSchedules();
    }
  };

  // Handle card press (edit)
  const handleCardPress = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setShowAddModal(true);
  };

  // Handle delete icon press
  const handleDeletePress = (schedule: Schedule) => {
    setDeletingSchedule(schedule);
  };

  // Render schedule card
  const renderItem = ({ item, index }: { item: Schedule; index: number }) => {
    return (
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [
            {
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}
      >
        <ScheduleCard
          schedule={item}
          onPress={() => handleCardPress(item)}
          onDelete={() => handleDeletePress(item)}
        />
      </Animated.View>
    );
  };

  // Render empty state
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={64} color={Colors.textMuted} />
      <Text style={styles.emptyTitle}>No Schedules</Text>
      <Text style={styles.emptyText}>
        Add your first schedule for {day} by tapping the + button
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </Pressable>

        <View style={styles.headerCenter}>
          <View style={styles.dayBadge}>
            <Ionicons name="calendar" size={20} color={Colors.primary} />
            <Text style={styles.dayText}>{day}</Text>
          </View>
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() => {
            setEditingSchedule(null);
            setShowAddModal(true);
          }}
        >
          <Ionicons name="add" size={24} color={Colors.black} />
        </Pressable>
      </Animated.View>

      {/* Schedule List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={schedules}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
        />
      )}

      {/* Add/Edit Modal */}
      <AddScheduleModal
        visible={showAddModal}
        schedule={editingSchedule}
        day={day || ""}
        onSave={handleSave}
        onCancel={() => {
          setShowAddModal(false);
          setEditingSchedule(null);
        }}
        onDelete={() => {
          if (editingSchedule) {
            setDeletingSchedule(editingSchedule);
            setShowAddModal(false);
            setEditingSchedule(null);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        visible={!!deletingSchedule}
        onConfirm={handleDelete}
        onCancel={() => setDeletingSchedule(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  dayBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundTertiary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  dayText: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Spacing.xxxl * 2,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: Spacing.sm,
    lineHeight: 22,
  },
});
