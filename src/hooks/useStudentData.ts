import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Course, Grade, Assignment, Schedule, Reminder, User } from '../types';
import { generateId, getColorFromString } from '../utils';

// Sample data for demonstration
const sampleCourses: Course[] = [
  {
    id: generateId(),
    name: 'Introduction to Computer Science',
    code: 'CS 101',
    credits: 3,
    color: '#3B82F6',
    instructor: 'Dr. Smith',
    semester: 'Fall 2024'
  },
  {
    id: generateId(),
    name: 'Calculus I',
    code: 'MATH 151',
    credits: 4,
    color: '#10B981',
    instructor: 'Prof. Johnson',
    semester: 'Fall 2024'
  },
  {
    id: generateId(),
    name: 'English Composition',
    code: 'ENG 101',
    credits: 3,
    color: '#F59E0B',
    instructor: 'Dr. Williams',
    semester: 'Fall 2024'
  }
];

const sampleGrades: Grade[] = [
  {
    id: generateId(),
    courseId: sampleCourses[0].id,
    assignmentName: 'Midterm Exam',
    grade: 85,
    maxPoints: 100,
    weight: 0.3,
    category: 'exam',
    date: new Date('2024-10-15')
  },
  {
    id: generateId(),
    courseId: sampleCourses[0].id,
    assignmentName: 'Programming Project 1',
    grade: 92,
    maxPoints: 100,
    weight: 0.2,
    category: 'project',
    date: new Date('2024-09-30')
  }
];

const sampleAssignments: Assignment[] = [
  {
    id: generateId(),
    courseId: sampleCourses[0].id,
    title: 'Final Project',
    description: 'Build a web application using React',
    dueDate: new Date('2024-12-15'),
    priority: 'high',
    status: 'in-progress',
    category: 'project'
  },
  {
    id: generateId(),
    courseId: sampleCourses[1].id,
    title: 'Homework 5',
    description: 'Integration problems',
    dueDate: new Date('2024-11-20'),
    priority: 'medium',
    status: 'pending',
    category: 'homework'
  }
];

const sampleSchedule: Schedule[] = [
  {
    id: generateId(),
    courseId: sampleCourses[0].id,
    dayOfWeek: 1, // Monday
    startTime: '09:00',
    endTime: '10:30',
    location: 'Room 101',
    type: 'lecture'
  },
  {
    id: generateId(),
    courseId: sampleCourses[0].id,
    dayOfWeek: 3, // Wednesday
    startTime: '09:00',
    endTime: '10:30',
    location: 'Room 101',
    type: 'lecture'
  }
];

export function useStudentData() {
  const [courses, setCourses] = useLocalStorage<Course[]>('courses', sampleCourses);
  const [grades, setGrades] = useLocalStorage<Grade[]>('grades', sampleGrades);
  const [assignments, setAssignments] = useLocalStorage<Assignment[]>('assignments', sampleAssignments);
  const [schedule, setSchedule] = useLocalStorage<Schedule[]>('schedule', sampleSchedule);
  const [reminders, setReminders] = useLocalStorage<Reminder[]>('reminders', []);
  const [user, setUser] = useLocalStorage<User | null>('user', null);

  // Course management
  const addCourse = (course: Omit<Course, 'id' | 'color'>) => {
    const newCourse: Course = {
      ...course,
      id: generateId(),
      color: getColorFromString(course.name)
    };
    setCourses(prev => [...prev, newCourse]);
    return newCourse;
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(course => 
      course.id === id ? { ...course, ...updates } : course
    ));
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
    setGrades(prev => prev.filter(grade => grade.courseId !== id));
    setAssignments(prev => prev.filter(assignment => assignment.courseId !== id));
    setSchedule(prev => prev.filter(scheduleItem => scheduleItem.courseId !== id));
  };

  // Grade management
  const addGrade = (grade: Omit<Grade, 'id'>) => {
    const newGrade: Grade = {
      ...grade,
      id: generateId()
    };
    setGrades(prev => [...prev, newGrade]);
    return newGrade;
  };

  const updateGrade = (id: string, updates: Partial<Grade>) => {
    setGrades(prev => prev.map(grade => 
      grade.id === id ? { ...grade, ...updates } : grade
    ));
  };

  const deleteGrade = (id: string) => {
    setGrades(prev => prev.filter(grade => grade.id !== id));
  };

  // Assignment management
  const addAssignment = (assignment: Omit<Assignment, 'id'>) => {
    const newAssignment: Assignment = {
      ...assignment,
      id: generateId()
    };
    setAssignments(prev => [...prev, newAssignment]);
    return newAssignment;
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === id ? { ...assignment, ...updates } : assignment
    ));
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== id));
  };

  // Schedule management
  const addScheduleItem = (scheduleItem: Omit<Schedule, 'id'>) => {
    const newScheduleItem: Schedule = {
      ...scheduleItem,
      id: generateId()
    };
    setSchedule(prev => [...prev, newScheduleItem]);
    return newScheduleItem;
  };

  const updateScheduleItem = (id: string, updates: Partial<Schedule>) => {
    setSchedule(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteScheduleItem = (id: string) => {
    setSchedule(prev => prev.filter(item => item.id !== id));
  };

  // Reminder management
  const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: generateId()
    };
    setReminders(prev => [...prev, newReminder]);
    return newReminder;
  };

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, ...updates } : reminder
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  return {
    // Data
    courses,
    grades,
    assignments,
    schedule,
    reminders,
    user,
    
    // Course methods
    addCourse,
    updateCourse,
    deleteCourse,
    
    // Grade methods
    addGrade,
    updateGrade,
    deleteGrade,
    
    // Assignment methods
    addAssignment,
    updateAssignment,
    deleteAssignment,
    
    // Schedule methods
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
    
    // Reminder methods
    addReminder,
    updateReminder,
    deleteReminder,
    
    // User methods
    setUser
  };
}
