export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  color: string;
  instructor?: string;
  semester: string;
}

export interface Grade {
  id: string;
  courseId: string;
  assignmentName: string;
  grade: number;
  maxPoints: number;
  weight: number;
  category: 'exam' | 'homework' | 'project' | 'quiz' | 'participation';
  date: Date;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  category: 'homework' | 'project' | 'exam' | 'quiz' | 'reading';
}

export interface Schedule {
  id: string;
  courseId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string;
  location?: string;
  type: 'lecture' | 'lab' | 'tutorial' | 'seminar';
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  date: Date;
  type: 'assignment' | 'exam' | 'event' | 'personal';
  isCompleted: boolean;
  assignmentId?: string;
}

export interface GPACalculation {
  overall: number;
  semester: number;
  courses: Array<{
    courseId: string;
    gpa: number;
    letterGrade: string;
  }>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  currentSemester: string;
  gpaTarget?: number;
}

export type ViewMode = 'dashboard' | 'grades' | 'calendar' | 'schedule' | 'settings';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'class' | 'assignment' | 'exam' | 'event';
  courseId?: string;
  color?: string;
}
