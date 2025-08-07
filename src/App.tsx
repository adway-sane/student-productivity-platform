import React, { useState } from 'react';
import { ViewMode } from './types';
import { useStudentData } from './hooks/useStudentData';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GradeTracker from './components/GradeTracker';
import Calendar from './components/Calendar';
import ScheduleManager from './components/ScheduleManager';
import Settings from './components/Settings';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const studentData = useStudentData();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard {...studentData} />;
      case 'grades':
        return <GradeTracker {...studentData} />;
      case 'calendar':
        return <Calendar {...studentData} />;
      case 'schedule':
        return <ScheduleManager {...studentData} />;
      case 'settings':
        return <Settings {...studentData} />;
      default:
        return <Dashboard {...studentData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          courses={studentData.courses}
        />

        {/* Main content */}
        <div className="flex-1 lg:pl-64">
          {/* Mobile header */}
          <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-2">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Page content */}
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {renderCurrentView()}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
