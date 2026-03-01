import { db } from "./database";

export const dao = {
  byDay(day: string): any[] {
    const result = db.getAllSync("SELECT * FROM routines WHERE day=?", [day]);
    return result;
  },

  insert(r: any) {
    db.runSync(
      "INSERT OR REPLACE INTO routines (id, day, timeLabel, subject, subjectCode, teacher, roomNo, startMinutes, endMinutes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [r.id, r.day, r.timeLabel, r.subject, r.subjectCode, r.teacher, r.roomNo, r.startMinutes, r.endMinutes]
    );
  },

  delete(id: string) {
    db.runSync("DELETE FROM routines WHERE id=?", [id]);
  }
};