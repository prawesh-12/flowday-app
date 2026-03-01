/**
 * Home Screen
 * Modern landing page with date strip, colorful day cards, and action buttons
 */
import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  useWindowDimensions,
  Pressable,
  FlatList,
  StatusBar,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ClassInfoModal } from "../../src/components";
import { Schedule } from "../../src/types";
import { scheduleDao } from "../../src/db";
import { Colors, Typography, Spacing, BorderRadius } from "../../src/theme";

// Day card colors - vibrant modern palette
const DAY_COLORS = {
  Monday: "#E8A87C", // Warm orange/peach
  Tuesday: "#41B3A3", // Teal
  Wednesday: "#E27D60", // Coral
  Thursday: "#C38D9E", // Muted pink
  Friday: "#85CDCA", // Light teal
};

const DAY_ICONS = {
  Monday: "rocket-outline",
  Tuesday: "heart-outline",
  Wednesday: "star-outline",
  Thursday: "diamond-outline",
  Friday: "sunny-outline",
};

// Generate dates for the horizontal strip
const generateDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = -3; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      date: date.getDate(),
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      fullDay: date.toLocaleDateString("en-US", { weekday: "long" }),
      isToday: i === 0,
      dateObj: date,
    });
  }
  return dates;
};

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const [currentClass, setCurrentClass] = useState<Schedule | null>(null);
  const [upcomingClass, setUpcomingClass] = useState<Schedule | null>(null);
  const [showCurrentModal, setShowCurrentModal] = useState(false);
  const [showUpcomingModal, setShowUpcomingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dates] = useState(generateDates());

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const hasAnimated = useRef(false);

  // Responsive sizing
  const isSmallScreen = height < 700;
  const cardWidth = (width - Spacing.lg * 2 - Spacing.sm) / 2;
  const dateItemWidth = 48;

  // Refresh class data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const current = scheduleDao.getCurrentClass();
      const upcoming = scheduleDao.getUpcomingClass();
      setCurrentClass(current);
      setUpcomingClass(upcoming);

      // Animate entrance only if not already visible
      if (!hasAnimated.current) {
        hasAnimated.current = true;
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      }

      // Don't reset animation on blur - prevents flicker during navigation
      return () => {};
    }, [])
  );

  const handleDayPress = (day: string) => {
    router.push(`/(tabs)/day/${day}`);
  };

  const handleDatePress = (dateItem: typeof dates[0]) => {
    setSelectedDate(dateItem.dateObj);
    // Navigate to the day's schedule
    const dayName = dateItem.fullDay;
    if (["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(dayName)) {
      handleDayPress(dayName);
    }
  };

  // Get today's info
  const today = new Date();
  const todayFormatted = today.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Render date item for horizontal strip
  const renderDateItem = ({ item }: { item: typeof dates[0] }) => (
    <Pressable
      style={[
        styles.dateItem,
        item.isToday && styles.dateItemActive,
      ]}
      onPress={() => handleDatePress(item)}
    >
      <Text style={[styles.dateNumber, item.isToday && styles.dateNumberActive]}>
        {item.date.toString().padStart(2, "0")}
      </Text>
      <Text style={[styles.dateDay, item.isToday && styles.dateDayActive]}>
        {item.day}
      </Text>
    </Pressable>
  );

  // Render day card
  const renderDayCard = (day: string, index: number) => {
    const color = DAY_COLORS[day as keyof typeof DAY_COLORS];
    const icon = DAY_ICONS[day as keyof typeof DAY_ICONS];
    const todayName = today.toLocaleDateString("en-US", { weekday: "long" });
    const isToday = day === todayName;

    return (
      <Animated.View
        key={day}
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: Animated.multiply(slideAnim, index * 0.2 + 1) }],
        }}
      >
        <Pressable
          style={[styles.dayCard, { backgroundColor: color, width: cardWidth }]}
          onPress={() => handleDayPress(day)}
        >
          <View style={styles.dayCardIcon}>
            <Ionicons name={icon as any} size={16} color="rgba(0,0,0,0.3)" />
          </View>
          {isToday && (
            <View style={styles.todayBadge}>
              <Text style={styles.todayBadgeText}>Today</Text>
            </View>
          )}
          <Text style={styles.dayCardTitle}>{day}</Text>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View style={styles.headerLeft}>
            <Text style={styles.welcomeText}>Welcome to,</Text>
            <Text style={styles.appName}>FlowDay</Text>
          </View>
          <View style={styles.logoCircle}>
            <Ionicons name="calendar" size={22} color={Colors.white} />
          </View>
        </Animated.View>

        {/* Date Strip Section */}
        <Animated.View style={[styles.dateSection, { opacity: fadeAnim }]}>
          <View style={styles.dateHeader}>
            <Text style={styles.currentDate}>{todayFormatted}</Text>
            <Ionicons name="chevron-down" size={18} color={Colors.textMuted} />
          </View>
          <Text style={styles.tasksInfo}>Your schedule for this week</Text>
          
          <FlatList
            data={dates}
            renderItem={renderDateItem}
            keyExtractor={(item) => item.date.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateList}
            initialScrollIndex={3}
            getItemLayout={(data, index) => ({
              length: dateItemWidth + Spacing.sm,
              offset: (dateItemWidth + Spacing.sm) * index,
              index,
            })}
          />
        </Animated.View>

        {/* Schedule Daywise Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule Daywise</Text>
          
          <View style={styles.daysGrid}>
            <View style={styles.daysRow}>
              {renderDayCard("Monday", 0)}
              {renderDayCard("Tuesday", 1)}
            </View>
            <View style={styles.daysRow}>
              {renderDayCard("Wednesday", 2)}
              {renderDayCard("Thursday", 3)}
            </View>
            <View style={styles.daysRowCenter}>
              {renderDayCard("Friday", 4)}
            </View>
          </View>
        </View>

        {/* Action Buttons Section */}
        <Animated.View style={[styles.actionSection, { opacity: fadeAnim }]}>
          <Pressable
            style={[styles.actionButton, styles.currentButton]}
            onPress={() => setShowCurrentModal(true)}
          >
            <View style={styles.actionIconWrapper}>
              <Ionicons name="radio-button-on" size={18} color="#41B3A3" />
            </View>
            <Text style={styles.actionButtonText}>Current Class</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.upcomingButton]}
            onPress={() => setShowUpcomingModal(true)}
          >
            <View style={styles.actionIconWrapper}>
              <Ionicons name="arrow-forward-circle" size={18} color="#E8A87C" />
            </View>
            <Text style={styles.actionButtonText}>Upcoming Class</Text>
          </Pressable>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable 
            style={styles.footerBox}
            onPress={() => Linking.openURL("https://prawesh.me")}
          >
            <Text style={styles.footerText}>
              Made with <Ionicons name="heart" size={14} color="#E27D60" /> by{" "}
              <Text style={styles.footerHighlight}>Prawesh</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Current Class Modal */}
      <ClassInfoModal
        visible={showCurrentModal}
        type="current"
        schedule={currentClass}
        onClose={() => setShowCurrentModal(false)}
      />

      {/* Upcoming Class Modal */}
      <ClassInfoModal
        visible={showUpcomingModal}
        type="upcoming"
        schedule={upcomingClass}
        onClose={() => setShowUpcomingModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  headerLeft: {
    flex: 1,
  },
  welcomeText: {
    ...Typography.body,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  appName: {
    ...Typography.h1,
    color: Colors.textPrimary,
    fontSize: 28,
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  dateSection: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
    padding: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  dateHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  currentDate: {
    ...Typography.bodyLarge,
    color: Colors.black,
    fontWeight: "600",
  },
  tasksInfo: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  dateList: {
    paddingVertical: Spacing.xs,
  },
  dateItem: {
    width: 48,
    height: 60,
    backgroundColor: "#F5F5F5",
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.xs,
  },
  dateItemActive: {
    backgroundColor: "#4A90D9",
  },
  dateNumber: {
    ...Typography.bodyLarge,
    color: Colors.black,
    fontWeight: "600",
  },
  dateNumberActive: {
    color: Colors.white,
  },
  dateDay: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  dateDayActive: {
    color: "rgba(255,255,255,0.8)",
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontWeight: "600",
  },
  daysGrid: {
    gap: Spacing.sm,
  },
  daysRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  daysRowCenter: {
    flexDirection: "row",
    justifyContent: "center",
  },
  dayCard: {
    height: 80,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    justifyContent: "flex-end",
    position: "relative",
    overflow: "hidden",
  },
  dayCardIcon: {
    position: "absolute",
    top: Spacing.sm,
    left: Spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  todayBadge: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  todayBadgeText: {
    ...Typography.captionSmall,
    color: Colors.white,
    fontWeight: "600",
  },
  dayCardTitle: {
    ...Typography.h3,
    color: Colors.white,
    fontWeight: "700",
  },
  actionSection: {
    flexDirection: "row",
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    gap: Spacing.xs,
  },
  currentButton: {
    marginTop: 22,
    borderWidth: 1,
    borderColor: "rgba(65, 179, 163, 0.3)",
  },
  upcomingButton: {
    marginTop: 22,
    borderWidth: 1,
    borderColor: "rgba(232, 168, 124, 0.3)",
  },
  actionIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    flex: 1,
  },
  footer: {
    alignItems: "center",
    marginTop: 50,
    paddingHorizontal: Spacing.md,
  },
  footerBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    shadowColor: "#E27D60",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  footerText: {
    ...Typography.body,
    color: Colors.textMuted,
    fontSize: 13,
  },
  footerHighlight: {
    color: "#E8A87C",
    fontWeight: "700",
  },
});
