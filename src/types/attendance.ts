
export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  classId: string;
  phone?: string;
  guardianPhone?: string;
  guardianEmail?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  teacherId: string;
  subjects: string[];
  classes: string[];
}

export interface Class {
  id: string;
  name: string;
  grade: string;
  section: string;
  teacherId: string;
  students: Student[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacherId: string;
  classId: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  teacherId: string;
  classId: string;
  subjectId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  timestamp: Date;
  notes?: string;
}

export interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  percentage: number;
}
