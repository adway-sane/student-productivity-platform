import React from 'react';
import { ViewMode, Course } from '../types';
import { cn } from '../utils';
import { 
  Home, 
  GraduationCap, 
  Calendar, 
  Clock, 
  Settings,
  X
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  courses: Course[];
}

const navigation = [
  { name: 'Dashboard', key: 'dashboard' as ViewMode, icon: Home },
  { name: 'Grades', key: 'grades' as ViewMode, icon: GraduationCap },
  { name: 'Calendar', key: 'calendar' as ViewMode, icon: Calendar },
  { name: 'Schedule', key: 'schedule' as ViewMode, icon: Clock },
  { name: 'Settings', key: 'settings' as ViewMode, icon: Settings },
];

export default function Sidebar({ 
  currentView, 
  setCurrentView, 
  sidebarOpen, 
  setSidebarOpen, 
  courses 
}: SidebarProps) {
  const handleNavClick = (view: ViewMode) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 bg-primary-600">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-semibold text-white">StudyHub</h1>
            <p className="text-xs text-primary-200">Student Platform</p>
          </div>
        </div>
        
        {/* Close button for mobile */}
        <button
          type="button"
          className="lg:hidden p-1 rounded-md text-primary-200 hover:text-white hover:bg-primary-700"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 bg-white">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              className={cn(
                'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                currentView === item.key
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
              aria-current={currentView === item.key ? 'page' : undefined}
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Courses section */}
      <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Current Courses
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center p-2 rounded-lg bg-white shadow-sm border border-gray-200"
              >
                <div
                  className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                  style={{ backgroundColor: course.color }}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {course.code}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {course.credits} credits
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No courses added yet
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50 lg:bg-white lg:shadow-lg">
        {sidebarContent}
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
}
