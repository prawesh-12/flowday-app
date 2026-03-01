/**
 * Schedule Data Access Object
 * Handles all database operations for schedules
 */
import { getDatabase } from "./database";
import { Schedule } from "../types";
import { timeToMinutes, sortSchedulesByTime } from "../utils/timeUtils";

/**
 * Generates a unique ID for new schedules
 */
function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const scheduleDao = {
  /**
   * Get all schedules for a specific day, sorted by start time
   * @param day - Day of the week (e.g., "Monday")
   * @returns Array of schedules sorted by startMinutes
   */
  getByDay(day: string): Schedule[] {
    const result = getDatabase().getAllSync(
      "SELECT * FROM schedules WHERE day = ? ORDER BY startMinutes ASC",
      [day]
    ) as Schedule[];
    return sortSchedulesByTime(result);
  },

  /**
   * Get all schedules from the database
   * @returns Array of all schedules
   */
  getAll(): Schedule[] {
    const result = getDatabase().getAllSync(
      "SELECT * FROM schedules ORDER BY day, startMinutes ASC"
    ) as Schedule[];
    return result;
  },

  /**
   * Get a single schedule by ID
   * @param id - Schedule ID
   * @returns Schedule or null if not found
   */
  getById(id: string): Schedule | null {
    const result = getDatabase().getAllSync(
      "SELECT * FROM schedules WHERE id = ?",
      [id]
    ) as Schedule[];
    return result.length > 0 ? result[0] : null;
  },

  /**
   * Insert a new schedule
   * @param schedule - Schedule data without ID
   * @returns The created schedule with generated ID
   */
  insert(schedule: Omit<Schedule, "id" | "startMinutes" | "endMinutes">): Schedule {
    const id = generateId();
    const startMinutes = timeToMinutes(schedule.startTime);
    const endMinutes = timeToMinutes(schedule.endTime);

    getDatabase().runSync(
      `INSERT INTO schedules 
       (id, day, startTime, endTime, startMinutes, endMinutes, room, subjectCode, subjectName, teacherName) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        schedule.day,
        schedule.startTime,
        schedule.endTime,
        startMinutes,
        endMinutes,
        schedule.room,
        schedule.subjectCode,
        schedule.subjectName,
        schedule.teacherName,
      ]
    );

    return {
      id,
      ...schedule,
      startMinutes,
      endMinutes,
    };
  },

  /**
   * Update an existing schedule
   * @param schedule - Complete schedule object with ID
   */
  update(schedule: Schedule): void {
    const startMinutes = timeToMinutes(schedule.startTime);
    const endMinutes = timeToMinutes(schedule.endTime);

    getDatabase().runSync(
      `UPDATE schedules SET 
       day = ?, startTime = ?, endTime = ?, startMinutes = ?, endMinutes = ?,
       room = ?, subjectCode = ?, subjectName = ?, teacherName = ?
       WHERE id = ?`,
      [
        schedule.day,
        schedule.startTime,
        schedule.endTime,
        startMinutes,
        endMinutes,
        schedule.room,
        schedule.subjectCode,
        schedule.subjectName,
        schedule.teacherName,
        schedule.id,
      ]
    );
  },

  /**
   * Delete a schedule by ID
   * @param id - Schedule ID to delete
   */
  delete(id: string): void {
    getDatabase().runSync("DELETE FROM schedules WHERE id = ?", [id]);
  },

  /**
   * Get the current class based on system time and day
   * @returns Current class or null if no class is in session
   */
  getCurrentClass(): Schedule | null {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = days[now.getDay()];

    const result = getDatabase().getAllSync(
      `SELECT * FROM schedules 
       WHERE day = ? AND startMinutes <= ? AND endMinutes > ?
       ORDER BY startMinutes ASC LIMIT 1`,
      [currentDay, currentMinutes, currentMinutes]
    ) as Schedule[];

    return result.length > 0 ? result[0] : null;
  },

  /**
   * Get the next upcoming class based on system time and day
   * If no more classes today, get the first class of the next weekday
   * @returns Upcoming class or null if no upcoming class found
   */
  getUpcomingClass(): Schedule | null {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const currentDay = days[now.getDay()];

    // First, check for upcoming class today
    const todayResult = getDatabase().getAllSync(
      `SELECT * FROM schedules 
       WHERE day = ? AND startMinutes > ?
       ORDER BY startMinutes ASC LIMIT 1`,
      [currentDay, currentMinutes]
    ) as Schedule[];

    if (todayResult.length > 0) {
      return todayResult[0];
    }

    // No more classes today, look for next weekday's first class
    const currentDayIndex = now.getDay();
    
    // Check the next 7 days to find the next class
    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (currentDayIndex + i) % 7;
      const nextDay = days[nextDayIndex];
      
      // Skip weekends (Sunday = 0, Saturday = 6)
      if (!weekdays.includes(nextDay)) {
        continue;
      }

      const nextDayResult = getDatabase().getAllSync(
        `SELECT * FROM schedules 
         WHERE day = ?
         ORDER BY startMinutes ASC LIMIT 1`,
        [nextDay]
      ) as Schedule[];

      if (nextDayResult.length > 0) {
        return nextDayResult[0];
      }
    }

    return null;
  },
};
