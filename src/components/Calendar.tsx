import React, { useState, useMemo } from 'react';
import { Course, Assignment, Schedule, Reminder, CalendarEvent } from '../types';
import { formatDate, getDayAbbreviation, isOverdue } from '../utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, isToday } from 'date-fns';

interface CalendarProps {
  courses: Course[];
  assignments: Assignment[];
  schedule: Schedule[];
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id'>) => Reminder;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
}

export default function Calendar({
  courses,
  assignments,
  schedule,
  reminders,
  addReminder,
  updateReminder
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [view, setView] = useState<'month' | 'week'>('month');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Create calendar events from all data sources
  const calendarEvents = useMemo((): CalendarEvent[] => {
    const events: CalendarEvent[] = [];

    // Add assignments as events
    assignments.forEach(assignment => {
      const course = courses.find(c => c.id === assignment.courseId);
      events.push({
        id: `assignment-${assignment.id}`,
        title: assignment.title,
        start: assignment.dueDate,
        end: assignment.dueDate,
        type: 'assignment',
        courseId: assignment.courseId,
        color: course?.color || '#6B7280'
      });
    });

    // Add schedule items as recurring events (simplified - just for current month)
    schedule.forEach(scheduleItem => {
      const course = courses.find(c => c.id === scheduleItem.courseId);
      monthDays
        .filter(day => day.getDay() === scheduleItem.dayOfWeek)
        .forEach(day => {
          const [startHour, startMinute] = scheduleItem.startTime.split(':').map(Number);
          const [endHour, endMinute] = scheduleItem.endTime.split(':').map(Number);
          
          const start = new Date(day);
          start.setHours(startHour, startMinute, 0, 0);
          
          const end = new Date(day);
          end.setHours(endHour, endMinute, 0, 0);

          events.push({
            id: `schedule-${scheduleItem.id}-${day.toISOString()}`,
            title: course?.name || 'Class',
            start,
            end,
            type: 'class',
            courseId: scheduleItem.courseId,
            color: course?.color || '#6B7280'
          });
        });
    });

    // Add reminders as events
    reminders.forEach(reminder => {
      events.push({
        id: `reminder-${reminder.id}`,
        title: reminder.title,
        start: reminder.date,
        end: reminder.date,
        type: 'event',
        color: reminder.type === 'assignment' ? '#EF4444' : 
               reminder.type === 'exam' ? '#F59E0B' : '#10B981'
      });
    });

    return events;
  }, [assignments, schedule, reminders, courses, monthDays]);

  const getEventsForDay = (date: Date) => {
    return calendarEvents.filter(event => isSameDay(event.start, date));
  };

  const getSelectedDateEvents = () => {
    if (!selectedDate) return [];
    return getEventsForDay(selectedDate);
  };

  const handleAddReminder = (formData: FormData) => {
    const reminder: Omit<Reminder, 'id'> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      date: new Date(formData.get('date') as string),
      type: formData.get('type') as Reminder['type'],
      isCompleted: false
    };
    
    addReminder(reminder);
    setShowAddReminder(false);
  };

  const toggleReminderComplete = (reminder: Reminder) => {
    updateReminder(reminder.id, { isCompleted: !reminder.isCompleted });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-500">Manage your academic schedule</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                view === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                view === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Week
            </button>
          </div>
          <button
            onClick={() => setShowAddReminder(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Reminder
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 card">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-gray-50 p-3 text-center">
                <span className="text-xs font-medium text-gray-500">{day}</span>
              </div>
            ))}

            {/* Calendar days */}
            {monthDays.map(day => {
              const dayEvents = getEventsForDay(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentDay = isToday(day);
              const isCurrentMonth = isSameMonth(day, currentDate);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`bg-white p-2 min-h-[80px] text-left hover:bg-gray-50 transition-colors ${
                    isSelected ? 'ring-2 ring-primary-500' : ''
                  } ${!isCurrentMonth ? 'text-gray-400' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${
                      isCurrentDay ? 'bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : ''
                    }`}>
                      {format(day, 'd')}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className="text-xs p-1 rounded text-white truncate"
                        style={{ backgroundColor: event.color }}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Events */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedDate ? format(selectedDate, 'EEEE, MMMM d') : 'Select a date'}
            </h3>
            
            <div className="space-y-3">
              {selectedDate && getSelectedDateEvents().length > 0 ? (
                getSelectedDateEvents().map(event => {
                  const course = event.courseId ? courses.find(c => c.id === event.courseId) : null;
                  
                  return (
                    <div key={event.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                      <div
                        className="w-3 h-3 rounded-full mr-3 mt-1 flex-shrink-0"
                        style={{ backgroundColor: event.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                        {course && (
                          <p className="text-xs text-gray-500">{course.code}</p>
                        )}
                        {event.type === 'class' && (
                          <p className="text-xs text-gray-500">
                            {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {event.type === 'assignment' && (
                          <Clock className="h-4 w-4 text-orange-500" />
                        )}
                        {event.type === 'class' && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : selectedDate ? (
                <p className="text-sm text-gray-500 text-center py-4">No events for this date</p>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Select a date to view events</p>
              )}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
            
            <div className="space-y-3">
              {assignments
                .filter(a => a.status !== 'completed' && !isOverdue(a.dueDate))
                .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
                .slice(0, 5)
                .map(assignment => {
                  const course = courses.find(c => c.id === assignment.courseId);
                  const daysUntil = Math.ceil((assignment.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={assignment.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div
                        className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                        style={{ backgroundColor: course?.color || '#6B7280' }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{assignment.title}</p>
                        <p className="text-xs text-gray-500">{course?.code}</p>
                      </div>
                      <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                        daysUntil <= 1 ? 'bg-red-100 text-red-800' :
                        daysUntil <= 3 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {daysUntil === 0 ? 'Today' : 
                         daysUntil === 1 ? 'Tomorrow' : 
                         `${daysUntil}d`}
                      </div>
                    </div>
                  );
                })}
              
              {assignments.filter(a => a.status !== 'completed' && !isOverdue(a.dueDate)).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No upcoming deadlines</p>
              )}
            </div>
          </div>

          {/* Reminders */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reminders</h3>
            
            <div className="space-y-3">
              {reminders.slice(0, 5).map(reminder => (
                <div key={reminder.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <button
                    onClick={() => toggleReminderComplete(reminder)}
                    className={`mr-3 flex-shrink-0 ${
                      reminder.isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      reminder.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}>
                      {reminder.title}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(reminder.date)}</p>
                  </div>
                  {isOverdue(reminder.date) && !reminder.isCompleted && (
                    <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  )}
                </div>
              ))}
              
              {reminders.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No reminders</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Reminder Modal */}
      {showAddReminder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Reminder</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddReminder(new FormData(e.currentTarget));
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input type="text" name="title" className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea name="description" rows={3} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                  <input 
                    type="datetime-local" 
                    name="date" 
                    className="input-field" 
                    defaultValue={selectedDate?.toISOString().slice(0, 16) || ''}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select name="type" className="input-field" required>
                    <option value="personal">Personal</option>
                    <option value="assignment">Assignment</option>
                    <option value="exam">Exam</option>
                    <option value="event">Event</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddReminder(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
