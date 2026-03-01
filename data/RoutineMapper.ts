import { Routine } from "./Routine";

/**
 * Converts "10 AM - 11 AM" → minutes from midnight
 */
export function parseTimeRange(time: string): {
  startMinutes: number;
  endMinutes: number;
} {
  const parts = time.split("-").map(p => p.trim().toUpperCase());

  const startMinutes = parseTime(parts[0]);
  const endMinutes = parts[1] ? parseTime(parts[1]) : startMinutes;

  return { startMinutes, endMinutes };
}

function parseTime(t: string): number {
  const match = t.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/);
  if (!match) return 0;

  let hour = parseInt(match[1], 10);
  const min = match[2] ? parseInt(match[2], 10) : 0;
  const period = match[3];

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return hour * 60 + min;
}

/**
 * Helper when creating/updating routines
 */
export function withParsedTime(
  routine: Omit<Routine, "startMinutes" | "endMinutes">
): Routine {
  const { startMinutes, endMinutes } = parseTimeRange(routine.timeLabel);
  return { ...routine, startMinutes, endMinutes };
}