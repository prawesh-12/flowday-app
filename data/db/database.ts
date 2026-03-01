import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("flowday.db");

db.execSync(`
  CREATE TABLE IF NOT EXISTS routines (
    id TEXT PRIMARY KEY NOT NULL,
    day TEXT,
    timeLabel TEXT,
    subject TEXT,
    subjectCode TEXT,
    teacher TEXT,
    roomNo TEXT,
    startMinutes INTEGER,
    endMinutes INTEGER
  );
`);