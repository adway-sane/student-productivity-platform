import React from 'react';
import { Course, Grade, Assignment, Schedule, Reminder } from '../types';
import { calculateGPA, formatDate, getDaysUntil, isOverdue } from '../utils';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  BookOpen,
  Target,
  Award
} from 'lucide-react';

interface DashboardProps {
  courses: Course[];
  grades: Grade[];
  assignments: Assignment[];
  schedule: Schedule[];
  reminders: Reminder[];
}

export default function Dashboard({ 
  courses, 
  grades, 
  assignments, 
  schedule, 
  reminders 
}: DashboardProps) {
  const gpaData = calculateGPA(grades, courses);
  const upcomingAssignments = assignments
    .filter(a => a.status !== 'completed' && !isOverdue(a.dueDate))
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 5);
  
  const overdueAssignments = assignments.filter(a => 
    a.status !== 'completed' && isOverdue(a.dueDate)
  );

  const todaySchedule = schedule.filter(s => s.dayOfWeek === new Date().getDay());

  const stats = [
    {
      name: 'Overall GPA',
      value: gpaData.overall.toFixed(2),
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+0.1',
      changeType: 'positive'
    },
    {
      name: 'Active Courses',
      value: courses.length.toString(),
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '',
      changeType: 'neutral'
    },
    {
      name: 'Pending Tasks',
      value: assignments.filter(a => a.status === 'pending').length.toString(),
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '-2',
      changeType: 'positive'
    },
    {
      name: 'Completed This Week',
      value: assignments.filter(a => a.status === 'completed').length.toString(),
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+3',
      changeType: 'positive'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
        <p className="text-primary-100">
          Here's your academic overview for {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card card-hover">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    {stat.change && (
                      <p className={`ml-2 text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Assignments */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Assignments</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {upcomingAssignments.length > 0 ? (
              upcomingAssignments.map((assignment) => {
                const course = courses.find(c => c.id === assignment.courseId);
                const daysUntil = getDaysUntil(assignment.dueDate);
                
                return (
                  <div key={assignment.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div
                      className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                      style={{ backgroundColor: course?.color || '#6B7280' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {assignment.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {course?.code} • Due {formatDate(assignment.dueDate)}
                      </p>
                    </div>
                    <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                      daysUntil <= 1 ? 'bg-red-100 text-red-800' :
                      daysUntil <= 3 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {daysUntil === 0 ? 'Today' : 
                       daysUntil === 1 ? 'Tomorrow' : 
                       `${daysUntil} days`}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                No upcoming assignments
              </p>
            )}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {todaySchedule.length > 0 ? (
              todaySchedule.map((scheduleItem) => {
                const course = courses.find(c => c.id === scheduleItem.courseId);
                
                return (
                  <div key={scheduleItem.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div
                      className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                      style={{ backgroundColor: course?.color || '#6B7280' }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {course?.name || 'Unknown Course'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {scheduleItem.startTime} - {scheduleItem.endTime}
                        {scheduleItem.location && ` • ${scheduleItem.location}`}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 capitalize">
                      {scheduleItem.type}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                No classes scheduled for today
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Overdue Assignments Alert */}
      {overdueAssignments.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <h3 className="text-sm font-medium text-red-800">
              {overdueAssignments.length} Overdue Assignment{overdueAssignments.length > 1 ? 's' : ''}
            </h3>
          </div>
          <div className="mt-2 space-y-1">
            {overdueAssignments.map((assignment) => {
              const course = courses.find(c => c.id === assignment.courseId);
              return (
                <p key={assignment.id} className="text-sm text-red-700">
                  {assignment.title} ({course?.code}) - Due {formatDate(assignment.dueDate)}
                </p>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button className="btn-secondary flex flex-col items-center p-4 space-y-2">
            <BookOpen className="h-6 w-6" />
            <span className="text-sm">Add Course</span>
          </button>
          <button className="btn-secondary flex flex-col items-center p-4 space-y-2">
            <Target className="h-6 w-6" />
            <span className="text-sm">New Task</span>
          </button>
          <button className="btn-secondary flex flex-col items-center p-4 space-y-2">
            <TrendingUp className="h-6 w-6" />
            <span className="text-sm">Add Grade</span>
          </button>
          <button className="btn-secondary flex flex-col items-center p-4 space-y-2">
            <Calendar className="h-6 w-6" />
            <span className="text-sm">Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
}
