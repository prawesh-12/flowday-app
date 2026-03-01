/**
 * Tabs Layout
 * Navigation configuration for the main tab screens
 */
import { Stack } from "expo-router";

export default function TabsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0D0D0D" },
        animation: "none",
      }}
    />
  );
}