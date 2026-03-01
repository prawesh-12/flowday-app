/**
 * SQLite Database Configuration
 * Initializes the database and creates the schedules table
 */
import * as SQLite from "expo-sqlite";
import { timeToMinutes } from "../utils/timeUtils";

// Database instance - initialized lazily
let db: SQLite.SQLiteDatabase | null = null;

/**
 * Get the database instance, opening it if necessary
 */
export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    db = SQLite.openDatabaseSync("flowday.db");
  }
  return db;
}

/**
 * Generates a unique ID
 */
function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Parse time label like "10 AM - 11 AM" into start and end times
 */
function parseTimeLabel(timeLabel: string): { startTime: string; endTime: string } {
  const parts = timeLabel.split(" - ");
  return {
    startTime: parts[0]?.trim() || "",
    endTime: parts[1]?.trim() || "",
  };
}

/**
 * Create a routine object for insertion
 */
function createRoutine(
  day: string,
  timeLabel: string,
  subjectName: string,
  subjectCode: string,
  teacherName: string,
  room: string
) {
  const { startTime, endTime } = parseTimeLabel(timeLabel);
  return {
    id: generateId(),
    day,
    startTime,
    endTime,
    startMinutes: timeToMinutes(startTime),
    endMinutes: timeToMinutes(endTime),
    room,
    subjectCode,
    subjectName,
    teacherName,
  };
}

/**
 * Insert a schedule into the database
 */
function insertSchedule(schedule: ReturnType<typeof createRoutine>): void {
  getDatabase().runSync(
    `INSERT INTO schedules 
     (id, day, startTime, endTime, startMinutes, endMinutes, room, subjectCode, subjectName, teacherName) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      schedule.id,
      schedule.day,
      schedule.startTime,
      schedule.endTime,
      schedule.startMinutes,
      schedule.endMinutes,
      schedule.room,
      schedule.subjectCode,
      schedule.subjectName,
      schedule.teacherName,
    ]
  );
}

/**
 * Pre-populate the database with sample schedules
 */
function prePopulateDatabase(): void {
  // Check if data already exists
  const result = getDatabase().getAllSync("SELECT COUNT(*) as count FROM schedules") as { count: number }[];
  if (result[0]?.count > 0) {
    return; // Data already exists, skip pre-population
  }

  // Monday
  insertSchedule(createRoutine("Monday", "10 AM - 11 AM", "AI", "23CP307T", "Trishna Paul", "E-310"));
  insertSchedule(createRoutine("Monday", "2 PM - 4 PM", "Advanced Web Lab", "23CP308P", "Nandini Modi", "E-307"));
  insertSchedule(createRoutine("Monday", "4 PM - 6 PM", "Disaster Management", "23CP309T", "Ravi kant", "E202"));

  // Tuesday
  insertSchedule(createRoutine("Tuesday", "11 AM - 12 PM", "Cyber Security", "23CP315T", "Aashka Raval", "E-310"));
  insertSchedule(createRoutine("Tuesday", "12 PM - 1 PM", "Cloud Computing", "23CP316T", "Punit Gupta", "E-307"));
  insertSchedule(createRoutine("Tuesday", "2 PM - 4 PM", "Cyber Security Lab", "23CP315P", "Aashka Raval", "E-216"));
  insertSchedule(createRoutine("Tuesday", "4 PM - 5 PM", "Disaster", "23CP309T", "Ravi kant", "E202"));

  // Wednesday
  insertSchedule(createRoutine("Wednesday", "9 AM - 11 AM", "Cloud Computing Lab", "23CP316P", "Punit Gupta", "E-306"));
  insertSchedule(createRoutine("Wednesday", "12 PM - 1 PM", "Cyber Security", "23CP315T", "Aashka Raval", "F-402"));
  insertSchedule(createRoutine("Wednesday", "2 PM - 3 PM", "AI", "23CP307T", "Trishna Paul", "E307"));

  // Thursday
  insertSchedule(createRoutine("Thursday", "9 AM - 11 AM", "CDC (Career Development - Lab)", "", "", "E-313"));
  insertSchedule(createRoutine("Thursday", "11 AM - 12 PM", "Cyber Security", "23CP315T", "Aashka Raval", "F-402"));
  insertSchedule(createRoutine("Thursday", "12 PM - 1 PM", "Cloud Computing", "23CP316T", "Punit Gupta", "F-403"));
  insertSchedule(createRoutine("Thursday", "3 PM - 4 PM", "AI", "23CP307T", "Trishna Paul", "F404"));

  // Friday
  insertSchedule(createRoutine("Friday", "9 AM - 11 AM", "AI Lab", "23CP307P", "Davinder Singh", "E-215"));
  insertSchedule(createRoutine("Friday", "11 AM - 12 PM", "Advanced Web", "23CP308T", "Nandini Modi", "F-404"));
  insertSchedule(createRoutine("Friday", "12 PM - 1 PM", "Cloud Computing", "23CP316T", "Punit Gupta", "F-402"));
}

/**
 * Initialize the database schema
 * Creates the schedules table if it doesn't exist
 */
export function initDatabase(): void {
  getDatabase().execSync(`
    CREATE TABLE IF NOT EXISTS schedules (
      id TEXT PRIMARY KEY NOT NULL,
      day TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      startMinutes INTEGER NOT NULL,
      endMinutes INTEGER NOT NULL,
      room TEXT NOT NULL,
      subjectCode TEXT NOT NULL,
      subjectName TEXT NOT NULL,
      teacherName TEXT NOT NULL
    );
  `);

  // Pre-populate with sample data
  prePopulateDatabase();
}

// Initialize database on import
initDatabase();
