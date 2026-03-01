export type Routine = {
  id: string;
  day: string;

  // used for sorting (like startMinutes in Room)
  startMinutes: number;
  endMinutes: number;

  // UI fields
  timeLabel: string;     // "10 AM - 11 AM"
  subject: string;
  subjectCode: string;
  teacher: string;
  roomNo: string;
};