import React, { useState } from 'react';
import { Course, User } from '../types';
import { 
  User as UserIcon, 
  BookOpen, 
  Plus, 
  Edit2, 
  Trash2, 
  Save,
  Target,
  Download,
  Upload
} from 'lucide-react';

interface SettingsProps {
  courses: Course[];
  user: User | null;
  setUser: (user: User | null) => void;
  addCourse: (course: Omit<Course, 'id' | 'color'>) => Course;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
}

export default function Settings({
  courses,
  user,
  setUser,
  addCourse,
  updateCourse,
  deleteCourse
}: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'courses' | 'preferences' | 'data'>('profile');
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [userForm, setUserForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentSemester: user?.currentSemester || '',
    gpaTarget: user?.gpaTarget || ''
  });

  const handleSaveProfile = () => {
    const userData: User = {
      id: user?.id || 'user-1',
      name: userForm.name,
      email: userForm.email,
      currentSemester: userForm.currentSemester,
      gpaTarget: userForm.gpaTarget ? parseFloat(String(userForm.gpaTarget)) : undefined
    };
    
    setUser(userData);
    alert('Profile saved successfully!');
  };

  const handleAddCourse = (formData: FormData) => {
    const course: Omit<Course, 'id' | 'color'> = {
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      credits: parseInt(formData.get('credits') as string),
      instructor: formData.get('instructor') as string || undefined,
      semester: formData.get('semester') as string
    };
    
    addCourse(course);
    setShowAddCourse(false);
  };

  const handleEditCourse = (formData: FormData) => {
    if (!editingCourse) return;
    
    const updates: Partial<Course> = {
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      credits: parseInt(formData.get('credits') as string),
      instructor: formData.get('instructor') as string || undefined,
      semester: formData.get('semester') as string
    };
    
    updateCourse(editingCourse.id, updates);
    setEditingCourse(null);
  };

  const exportData = () => {
    const data = {
      courses,
      user,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student-data-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.user) setUser(data.user);
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'courses', name: 'Courses', icon: BookOpen },
    { id: 'preferences', name: 'Preferences', icon: Target },
    { id: 'data', name: 'Data', icon: Download }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account and application preferences</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'profile' && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="input-field"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Semester</label>
                <input
                  type="text"
                  value={userForm.currentSemester}
                  onChange={(e) => setUserForm({ ...userForm, currentSemester: e.target.value })}
                  className="input-field"
                  placeholder="Fall 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GPA Target</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={userForm.gpaTarget}
                  onChange={(e) => setUserForm({ ...userForm, gpaTarget: e.target.value })}
                  className="input-field"
                  placeholder="3.50"
                />
              </div>
            </div>
            <div className="mt-6">
              <button onClick={handleSaveProfile} className="btn-primary flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </button>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Course Management</h3>
              <button
                onClick={() => setShowAddCourse(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <div key={course.id} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: course.color }}
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{course.code}</h4>
                        <p className="text-xs text-gray-500">{course.credits} credits</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingCourse(course)}
                        className="text-primary-600 hover:text-primary-900"
                        aria-label="Edit course"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteCourse(course.id)}
                        className="text-red-600 hover:text-red-900"
                        aria-label="Delete course"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">{course.name}</p>
                    {course.instructor && (
                      <p className="text-xs text-gray-500">{course.instructor}</p>
                    )}
                    <p className="text-xs text-gray-500">{course.semester}</p>
                  </div>
                </div>
              ))}
              
              {courses.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No courses added yet</p>
                  <button
                    onClick={() => setShowAddCourse(true)}
                    className="btn-primary mt-4"
                  >
                    Add Your First Course
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Preferences</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Theme</h4>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input type="radio" name="theme" value="light" defaultChecked className="mr-2" />
                    Light
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="theme" value="dark" className="mr-2" />
                    Dark
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="theme" value="auto" className="mr-2" />
                    Auto
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Notifications</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    Assignment reminders
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    Grade updates
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Weekly progress reports
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Default View</h4>
                <select className="input-field max-w-xs">
                  <option value="dashboard">Dashboard</option>
                  <option value="calendar">Calendar</option>
                  <option value="grades">Grades</option>
                  <option value="schedule">Schedule</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Export Data</h4>
                  <p className="text-sm text-gray-500 mb-3">
                    Download a backup of all your data including courses, grades, and assignments.
                  </p>
                  <button onClick={exportData} className="btn-secondary flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </button>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Import Data</h4>
                  <p className="text-sm text-gray-500 mb-3">
                    Import data from a previously exported backup file.
                  </p>
                  <label className="btn-secondary flex items-center cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                    <input
                      type="file"
                      accept=".json"
                      onChange={importData}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Info</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Courses:</span>
                  <span className="text-gray-900">{courses.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Data stored locally:</span>
                  <span className="text-gray-900">Yes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last backup:</span>
                  <span className="text-gray-900">Never</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Course Modal */}
      {showAddCourse && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Course</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddCourse(new FormData(e.currentTarget));
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course Code</label>
                  <input type="text" name="code" className="input-field" placeholder="CS 101" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course Name</label>
                  <input type="text" name="name" className="input-field" placeholder="Introduction to Computer Science" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Credits</label>
                  <input type="number" name="credits" min="1" max="6" className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Instructor</label>
                  <input type="text" name="instructor" className="input-field" placeholder="Dr. Smith" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Semester</label>
                  <input type="text" name="semester" className="input-field" placeholder="Fall 2024" required />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddCourse(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Course</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleEditCourse(new FormData(e.currentTarget));
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course Code</label>
                  <input 
                    type="text" 
                    name="code" 
                    className="input-field" 
                    defaultValue={editingCourse.code}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    className="input-field" 
                    defaultValue={editingCourse.name}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Credits</label>
                  <input 
                    type="number" 
                    name="credits" 
                    min="1" 
                    max="6" 
                    className="input-field" 
                    defaultValue={editingCourse.credits}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Instructor</label>
                  <input 
                    type="text" 
                    name="instructor" 
                    className="input-field" 
                    defaultValue={editingCourse.instructor || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Semester</label>
                  <input 
                    type="text" 
                    name="semester" 
                    className="input-field" 
                    defaultValue={editingCourse.semester}
                    required 
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
