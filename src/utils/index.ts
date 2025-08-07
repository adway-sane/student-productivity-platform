import { Grade, Course, GPACalculation } from '../types';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function calculateGPA(grades: Grade[], courses: Course[]): GPACalculation {
  const courseGPAs = new Map<string, { totalPoints: number; totalCredits: number; grades: Grade[] }>();
  
  // Group grades by course
  grades.forEach(grade => {
    const course = courses.find(c => c.id === grade.courseId);
    if (!course) return;
    
    if (!courseGPAs.has(grade.courseId)) {
      courseGPAs.set(grade.courseId, { totalPoints: 0, totalCredits: course.credits, grades: [] });
    }
    
    const courseData = courseGPAs.get(grade.courseId)!;
    courseData.grades.push(grade);
  });
  
  const coursesWithGPA = Array.from(courseGPAs.entries()).map(([courseId, data]) => {
    const weightedSum = data.grades.reduce((sum, grade) => {
      return sum + (grade.grade / grade.maxPoints) * grade.weight;
    }, 0);
    
    const totalWeight = data.grades.reduce((sum, grade) => sum + grade.weight, 0);
    const coursePercentage = totalWeight > 0 ? weightedSum / totalWeight : 0;
    const gpa = percentageToGPA(coursePercentage * 100);
    
    return {
      courseId,
      gpa,
      letterGrade: percentageToLetterGrade(coursePercentage * 100)
    };
  });
  
  // Calculate overall GPA
  let totalGradePoints = 0;
  let totalCredits = 0;
  
  coursesWithGPA.forEach(({ courseId, gpa }) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      totalGradePoints += gpa * course.credits;
      totalCredits += course.credits;
    }
  });
  
  const overallGPA = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
  
  return {
    overall: Math.round(overallGPA * 100) / 100,
    semester: Math.round(overallGPA * 100) / 100, // Simplified for demo
    courses: coursesWithGPA
  };
}

export function percentageToGPA(percentage: number): number {
  if (percentage >= 97) return 4.0;
  if (percentage >= 93) return 3.7;
  if (percentage >= 90) return 3.3;
  if (percentage >= 87) return 3.0;
  if (percentage >= 83) return 2.7;
  if (percentage >= 80) return 2.3;
  if (percentage >= 77) return 2.0;
  if (percentage >= 73) return 1.7;
  if (percentage >= 70) return 1.3;
  if (percentage >= 67) return 1.0;
  if (percentage >= 65) return 0.7;
  return 0.0;
}

export function percentageToLetterGrade(percentage: number): string {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 65) return 'D';
  return 'F';
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function getDayName(dayNumber: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNumber];
}

export function getDayAbbreviation(dayNumber: number): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[dayNumber];
}

export function isOverdue(date: Date): boolean {
  return date < new Date();
}

export function getDaysUntil(date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function getColorFromString(str: string): string {
  const colors = [
    '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444',
    '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#84CC16'
  ];
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
