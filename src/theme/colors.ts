/**
 * Theme Colors for FlowDay App
 * Premium dark UI color palette with white cards
 */
export const Colors = {
  // Background colors
  background: "#0D0D0D",
  backgroundSecondary: "#1A1A1A",
  backgroundTertiary: "#2A2A2A",

  // Card colors - White cards with dark text
  card: "#FFFFFF",
  cardBorder: "#E0E0E0",
  cardHover: "#F5F5F5",

  // Primary accent colors
  primary: "#FFFFFF",
  primaryLight: "#F5F5F5",
  primaryDark: "#E0E0E0",

  // Secondary colors
  secondary: "#FF6B6B",
  accent: "#4ECDC4",

  // Text colors
  textPrimary: "#FFFFFF",
  textSecondary: "#B3B3B3",
  textMuted: "#666666",
  textPlaceholder: "#999999",
  textDark: "#000000",
  textOnCard: "#000000",

  // Status colors
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
  info: "#2196F3",

  // Button colors
  buttonPrimary: "#FFFFFF",
  buttonSecondary: "#2D2D2D",
  buttonDanger: "#FF4444",
  buttonCancel: "#404040",

  // Border colors
  border: "#333333",
  borderLight: "#404040",
  divider: "#2A2A2A",

  // Overlay
  overlay: "rgba(0, 0, 0, 0.7)",
  modalBackground: "rgba(0, 0, 0, 0.85)",

  // Shadow
  shadow: "#000000",

  // Gradient colors
  gradientStart: "#FFFFFF",
  gradientEnd: "#F5F5F5",

  // Special colors
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
};

export type ColorKey = keyof typeof Colors;
