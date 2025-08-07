import React, { useState } from 'react';
import { Course, Schedule } from '../types';
import { formatTime, getDayName, getDayAbbreviation } from '../utils';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Clock, 
  MapPin,
  BookOpen
} from 'lucide-react';

interface ScheduleManagerProps {
  courses: Course[];
  schedule: Schedule[];
  addScheduleItem: (scheduleItem: Omit<Schedule, 'id'>) => Schedule;
  updateScheduleItem: (id: string, updates: Partial<Schedule>) => void;
  deleteScheduleItem: (id: string) => void;
}

const DAYS = [
  { number: 1, name: 'Monday', abbrev: 'Mon' },
  { number: 2, name: 'Tuesday', abbrev: 'Tue' },
  { number: 3, name: 'Wednesday', abbrev: 'Wed' },
  { number: 4, name: 'Thursday', abbrev: 'Thu' },
  { number: 5, name: 'Friday', abbrev: 'Fri' },
  { number: 6, name: 'Saturday', abbrev: 'Sat' },
  { number: 0, name: 'Sunday', abbrev: 'Sun' }
];

const TIME_SLOTS = Array.from({ length: 14 }, (_, i) => {
  const hour = i + 8; // Start from 8 AM
  return {
    time: `${hour.toString().padStart(2, '0')}:00`,
    display: hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`
  };
});

export default function ScheduleManager({
  courses,
  schedule,
  addScheduleItem,
  updateScheduleItem,
  deleteScheduleItem
}: ScheduleManagerProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Schedule | null>(null);

  const handleAddScheduleItem = (formData: FormData) => {
    const scheduleItem: Omit<Schedule, 'id'> = {
      courseId: formData.get('courseId') as string,
      dayOfWeek: parseInt(formData.get('dayOfWeek') as string),
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      location: formData.get('location') as string || undefined,
      type: formData.get('type') as Schedule['type']
    };
    
    addScheduleItem(scheduleItem);
    setShowAddForm(false);
  };

  const handleEditScheduleItem = (formData: FormData) => {
    if (!editingItem) return;
    
    const updates: Partial<Schedule> = {
      dayOfWeek: parseInt(formData.get('dayOfWeek') as string),
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      location: formData.get('location') as string || undefined,
      type: formData.get('type') as Schedule['type']
    };
    
    updateScheduleItem(editingItem.id, updates);
    setEditingItem(null);
  };

  const getScheduleForDay = (dayNumber: number) => {
    return schedule
      .filter(item => item.dayOfWeek === dayNumber)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getTimeSlotHeight = (startTime: string, endTime: string) => {
    const start = parseTime(startTime);
    const end = parseTime(endTime);
    const duration = end - start;
    return Math.max(60, duration * 60); // Minimum 60px height
  };

  const getTimeSlotTop = (startTime: string) => {
    const start = parseTime(startTime);
    const baseTime = 8; // 8 AM
    return (start - baseTime) * 60; // 60px per hour
  };

  function parseTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + minutes / 60;
  }

  const renderGridView = () => (
    <div className="card">
      <div className="grid grid-cols-8 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {/* Header row */}
        <div className="bg-gray-50 p-3">
          <span className="text-xs font-medium text-gray-500">Time</span>
        </div>
        {DAYS.map(day => (
          <div key={day.number} className="bg-gray-50 p-3 text-center">
            <span className="text-xs font-medium text-gray-500">{day.abbrev}</span>
          </div>
        ))}

        {/* Time slots */}
        {TIME_SLOTS.map(timeSlot => (
          <React.Fragment key={timeSlot.time}>
            <div className="bg-white p-2 border-r border-gray-100">
              <span className="text-xs text-gray-500">{timeSlot.display}</span>
            </div>
            {DAYS.map(day => {
              const daySchedule = getScheduleForDay(day.number);
              const currentSlotItems = daySchedule.filter(item => {
                const itemStart = parseTime(item.startTime);
                const slotStart = parseTime(timeSlot.time);
                return itemStart <= slotStart && parseTime(item.endTime) > slotStart;
              });

              return (
                <div key={`${day.number}-${timeSlot.time}`} className="bg-white p-1 min-h-[60px] relative">
                  {currentSlotItems.map(item => {
                    const course = courses.find(c => c.id === item.courseId);
                    const itemStart = parseTime(item.startTime);
                    const slotStart = parseTime(timeSlot.time);
                    
                    // Only render if this is the starting slot for the item
                    if (itemStart === slotStart) {
                      return (
                        <div
                          key={item.id}
                          className="absolute left-1 right-1 p-2 rounded text-white text-xs cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ 
                            backgroundColor: course?.color || '#6B7280',
                            height: `${getTimeSlotHeight(item.startTime, item.endTime)}px`,
                            zIndex: 10
                          }}
                          onClick={() => setEditingItem(item)}
                        >
                          <div className="font-medium truncate">{course?.code}</div>
                          <div className="text-xs opacity-90 truncate">{item.type}</div>
                          {item.location && (
                            <div className="text-xs opacity-75 truncate">{item.location}</div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderListView = () => (
    <div className="space-y-6">
      {DAYS.map(day => {
        const daySchedule = getScheduleForDay(day.number);
        
        return (
          <div key={day.number} className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{day.name}</h3>
            
            <div className="space-y-3">
              {daySchedule.length > 0 ? (
                daySchedule.map(item => {
                  const course = courses.find(c => c.id === item.courseId);
                  
                  return (
                    <div key={item.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div
                        className="w-4 h-4 rounded-full mr-4 flex-shrink-0"
                        style={{ backgroundColor: course?.color || '#6B7280' }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {course?.name || 'Unknown Course'}
                            </p>
                            <p className="text-xs text-gray-500">{course?.code}</p>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatTime(item.startTime)} - {formatTime(item.endTime)}
                          </div>
                          {item.location && (
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1" />
                              {item.location}
                            </div>
                          )}
                          <div className="px-2 py-1 bg-gray-200 text-xs rounded-full capitalize">
                            {item.type}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="text-primary-600 hover:text-primary-900"
                          aria-label="Edit schedule item"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteScheduleItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                          aria-label="Delete schedule item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No classes scheduled</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule Manager</h1>
          <p className="text-gray-500">Organize your class schedule</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('grid')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                view === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              List
            </button>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </button>
        </div>
      </div>

      {/* Schedule Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <BookOpen className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Total Classes</p>
          <p className="text-2xl font-bold text-gray-900">{schedule.length}</p>
        </div>
        <div className="card text-center">
          <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Hours per Week</p>
          <p className="text-2xl font-bold text-gray-900">
            {schedule.reduce((total, item) => {
              const duration = parseTime(item.endTime) - parseTime(item.startTime);
              return total + duration;
            }, 0).toFixed(1)}
          </p>
        </div>
        <div className="card text-center">
          <MapPin className="h-8 w-8 text-orange-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Unique Locations</p>
          <p className="text-2xl font-bold text-gray-900">
            {new Set(schedule.map(item => item.location).filter(Boolean)).size}
          </p>
        </div>
      </div>

      {/* Schedule View */}
      {view === 'grid' ? renderGridView() : renderListView()}

      {/* Add Schedule Item Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Class Schedule</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddScheduleItem(new FormData(e.currentTarget));
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course</label>
                  <select name="courseId" className="input-field" required>
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.code} - {course.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Day of Week</label>
                  <select name="dayOfWeek" className="input-field" required>
                    <option value="">Select a day</option>
                    {DAYS.map(day => (
                      <option key={day.number} value={day.number}>{day.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                    <input type="time" name="startTime" className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                    <input type="time" name="endTime" className="input-field" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input type="text" name="location" className="input-field" placeholder="Room 101, Building A" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select name="type" className="input-field" required>
                    <option value="">Select type</option>
                    <option value="lecture">Lecture</option>
                    <option value="lab">Lab</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="seminar">Seminar</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Schedule Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Class Schedule</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleEditScheduleItem(new FormData(e.currentTarget));
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course</label>
                  <select name="courseId" className="input-field" defaultValue={editingItem.courseId} disabled>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.code} - {course.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Day of Week</label>
                  <select name="dayOfWeek" className="input-field" defaultValue={editingItem.dayOfWeek} required>
                    {DAYS.map(day => (
                      <option key={day.number} value={day.number}>{day.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                    <input 
                      type="time" 
                      name="startTime" 
                      className="input-field" 
                      defaultValue={editingItem.startTime}
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                    <input 
                      type="time" 
                      name="endTime" 
                      className="input-field" 
                      defaultValue={editingItem.endTime}
                      required 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input 
                    type="text" 
                    name="location" 
                    className="input-field" 
                    defaultValue={editingItem.location || ''}
                    placeholder="Room 101, Building A" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select name="type" className="input-field" defaultValue={editingItem.type} required>
                    <option value="lecture">Lecture</option>
                    <option value="lab">Lab</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="seminar">Seminar</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
