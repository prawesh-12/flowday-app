/**
 * Schedule Type Definition
 * Represents a single class schedule entry
 */
export interface Schedule {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  startMinutes: number;
  endMinutes: number;
  room: string;
  subjectCode: string;
  subjectName: string;
  teacherName: string;
}

/**
 * Input type for creating/updating a schedule
 */
export interface ScheduleInput {
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  subjectCode: string;
  subjectName: string;
  teacherName: string;
}

/**
 * Days of the week for the schedule
 */
export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;

export type DayType = (typeof DAYS)[number];
