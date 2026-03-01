/**
 * Time Utilities for FlowDay App
 * Handles time parsing, formatting, and sorting logic
 */

/**
 * Converts a time string (e.g., "10:30 AM", "2:00 PM") to minutes since midnight
 * @param timeStr - Time string in format "HH:MM AM/PM" or "H:MM AM/PM"
 * @returns Minutes since midnight (0-1439)
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;

  const cleanTime = timeStr.trim().toUpperCase();
  const isPM = cleanTime.includes("PM");
  const isAM = cleanTime.includes("AM");

  // Remove AM/PM and trim
  const timePart = cleanTime.replace(/\s*(AM|PM)\s*/gi, "").trim();
  const [hourStr, minuteStr = "0"] = timePart.split(":");

  let hours = parseInt(hourStr, 10);
  const minutes = parseInt(minuteStr, 10);

  if (isNaN(hours) || isNaN(minutes)) return 0;

  // Convert to 24-hour format
  if (isPM && hours !== 12) {
    hours += 12;
  } else if (isAM && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

/**
 * Converts minutes since midnight to a formatted time string
 * @param minutes - Minutes since midnight (0-1439)
 * @returns Formatted time string (e.g., "10:30 AM")
 */
export function minutesToTime(minutes: number): string {
  if (minutes < 0 || minutes >= 1440) return "12:00 AM";

  let hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
  }

  const minsStr = mins.toString().padStart(2, "0");
  return `${hours}:${minsStr} ${period}`;
}

/**
 * Creates a time label from start and end time strings
 * @param startTime - Start time string (e.g., "10:00 AM")
 * @param endTime - End time string (e.g., "11:00 AM")
 * @returns Combined time label (e.g., "10:00 AM - 11:00 AM")
 */
export function createTimeLabel(startTime: string, endTime: string): string {
  return `${startTime} - ${endTime}`;
}

/**
 * Parses a time label to extract start and end times
 * @param timeLabel - Time label string (e.g., "10:00 AM - 11:00 AM")
 * @returns Object with startTime and endTime strings
 */
export function parseTimeLabel(timeLabel: string): { startTime: string; endTime: string } {
  const parts = timeLabel.split(" - ");
  return {
    startTime: parts[0]?.trim() || "",
    endTime: parts[1]?.trim() || "",
  };
}

/**
 * Gets current minutes since midnight
 * @returns Current time as minutes since midnight
 */
export function getCurrentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

/**
 * Gets current day of week as string
 * @returns Day name (e.g., "Monday", "Tuesday")
 */
export function getCurrentDay(): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date().getDay()];
}

/**
 * Validates if a time string is in correct format
 * @param timeStr - Time string to validate
 * @returns Boolean indicating if the format is valid
 */
export function isValidTimeFormat(timeStr: string): boolean {
  if (!timeStr) return false;
  const regex = /^(1[0-2]|0?[1-9]):([0-5][0-9])\s*(AM|PM)$/i;
  return regex.test(timeStr.trim());
}

/**
 * Formats a simple time input (HH:MM) with AM/PM
 * @param time - Time in HH:MM format
 * @param period - "AM" or "PM"
 * @returns Formatted time string
 */
export function formatTimeWithPeriod(time: string, period: "AM" | "PM"): string {
  return `${time} ${period}`;
}

/**
 * Sort schedules by start time (minutes)
 * @param schedules - Array of schedule objects with startMinutes property
 * @returns Sorted array of schedules
 */
export function sortSchedulesByTime<T extends { startMinutes: number }>(schedules: T[]): T[] {
  return [...schedules].sort((a, b) => a.startMinutes - b.startMinutes);
}
