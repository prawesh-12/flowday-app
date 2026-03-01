/**
 * Root Layout
 * App entry point with navigation configuration
 */
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Initialize database
import "../src/db/database";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: "#0D0D0D" }}>
        <StatusBar style="light" backgroundColor="#0D0D0D" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#0D0D0D" },
            animation: "none",
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}