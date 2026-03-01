/**
 * Typography Configuration
 * Font sizes, weights, and styles
 */
import { TextStyle } from "react-native";

export const Typography = {
  // Headers
  h1: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: 0.5,
  } as TextStyle,

  h2: {
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 0.3,
  } as TextStyle,

  h3: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.2,
  } as TextStyle,

  // Body text
  bodyLarge: {
    fontSize: 18,
    fontWeight: "500",
  } as TextStyle,

  body: {
    fontSize: 16,
    fontWeight: "400",
  } as TextStyle,

  bodySmall: {
    fontSize: 14,
    fontWeight: "400",
  } as TextStyle,

  // Labels
  label: {
    fontSize: 14,
    fontWeight: "500",
  } as TextStyle,

  labelSmall: {
    fontSize: 12,
    fontWeight: "500",
  } as TextStyle,

  // Caption
  caption: {
    fontSize: 12,
    fontWeight: "400",
  } as TextStyle,

  captionSmall: {
    fontSize: 10,
    fontWeight: "400",
  } as TextStyle,

  // Button text
  button: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  } as TextStyle,

  buttonSmall: {
    fontSize: 14,
    fontWeight: "600",
  } as TextStyle,
};

export type TypographyKey = keyof typeof Typography;
