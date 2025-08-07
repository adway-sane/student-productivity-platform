import React, { useState } from 'react';
import { Course, Grade } from '../types';
import { calculateGPA, percentageToLetterGrade, formatDate } from '../utils';
import { 
  TrendingUp, 
  Plus, 
  Edit2, 
  Trash2, 
  Award,
  BookOpen,
  Target
} from 'lucide-react';

interface GradeTrackerProps {
  courses: Course[];
  grades: Grade[];
  addGrade: (grade: Omit<Grade, 'id'>) => Grade;
  updateGrade: (id: string, updates: Partial<Grade>) => void;
  deleteGrade: (id: string) => void;
}

export default function GradeTracker({
  courses,
  grades,
  addGrade,
  updateGrade,
  deleteGrade
}: GradeTrackerProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);

  const gpaData = calculateGPA(grades, courses);
  
  const filteredGrades = selectedCourse === 'all' 
    ? grades 
    : grades.filter(grade => grade.courseId === selectedCourse);

  const courseGrades = courses.map(course => {
    const courseGradesData = grades.filter(g => g.courseId === course.id);
    const courseGPA = gpaData.courses.find(c => c.courseId === course.id);
    
    return {
      course,
      grades: courseGradesData,
      gpa: courseGPA?.gpa || 0,
      letterGrade: courseGPA?.letterGrade || 'N/A'
    };
  });

  const handleAddGrade = (formData: FormData) => {
    const grade: Omit<Grade, 'id'> = {
      courseId: formData.get('courseId') as string,
      assignmentName: formData.get('assignmentName') as string,
      grade: parseFloat(formData.get('grade') as string),
      maxPoints: parseFloat(formData.get('maxPoints') as string),
      weight: parseFloat(formData.get('weight') as string),
      category: formData.get('category') as Grade['category'],
      date: new Date(formData.get('date') as string)
    };
    
    addGrade(grade);
    setShowAddForm(false);
  };

  const handleEditGrade = (formData: FormData) => {
    if (!editingGrade) return;
    
    const updates: Partial<Grade> = {
      assignmentName: formData.get('assignmentName') as string,
      grade: parseFloat(formData.get('grade') as string),
      maxPoints: parseFloat(formData.get('maxPoints') as string),
      weight: parseFloat(formData.get('weight') as string),
      category: formData.get('category') as Grade['category'],
      date: new Date(formData.get('date') as string)
    };
    
    updateGrade(editingGrade.id, updates);
    setEditingGrade(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grade Tracker</h1>
          <p className="text-gray-500">Monitor your academic performance</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Grade
        </button>
      </div>

      {/* GPA Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <Award className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Overall GPA</p>
          <p className="text-3xl font-bold text-gray-900">{gpaData.overall.toFixed(2)}</p>
        </div>
        <div className="card text-center">
          <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Semester GPA</p>
          <p className="text-3xl font-bold text-gray-900">{gpaData.semester.toFixed(2)}</p>
        </div>
        <div className="card text-center">
          <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Total Grades</p>
          <p className="text-3xl font-bold text-gray-900">{grades.length}</p>
        </div>
      </div>

      {/* Course Filter */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter by course:</span>
          <button
            onClick={() => setSelectedCourse('all')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedCourse === 'all'
                ? 'bg-primary-100 text-primary-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Courses
          </button>
          {courses.map(course => (
            <button
              key={course.id}
              onClick={() => setSelectedCourse(course.id)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedCourse === course.id
                  ? 'bg-primary-100 text-primary-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {course.code}
            </button>
          ))}
        </div>
      </div>

      {/* Course Performance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courseGrades.map(({ course, grades: courseGradesData, gpa, letterGrade }) => (
          <div key={course.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: course.color }}
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{course.code}</h3>
                  <p className="text-sm text-gray-500">{course.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{letterGrade}</p>
                <p className="text-sm text-gray-500">{gpa.toFixed(2)} GPA</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {courseGradesData.length > 0 ? (
                courseGradesData.slice(0, 3).map(grade => (
                  <div key={grade.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{grade.assignmentName}</p>
                      <p className="text-xs text-gray-500 capitalize">{grade.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {grade.grade}/{grade.maxPoints}
                      </p>
                      <p className="text-xs text-gray-500">
                        {((grade.grade / grade.maxPoints) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No grades yet</p>
              )}
              
              {courseGradesData.length > 3 && (
                <p className="text-xs text-gray-500 text-center">
                  +{courseGradesData.length - 3} more grades
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Grades Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedCourse === 'all' ? 'All Grades' : 
             courses.find(c => c.id === selectedCourse)?.code + ' Grades'}
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGrades.length > 0 ? (
                filteredGrades.map((grade) => {
                  const course = courses.find(c => c.id === grade.courseId);
                  const percentage = (grade.grade / grade.maxPoints) * 100;
                  
                  return (
                    <tr key={grade.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-900">{grade.assignmentName}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: course?.color }}
                          />
                          <span className="text-sm text-gray-900">{course?.code}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 capitalize">{grade.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {grade.grade}/{grade.maxPoints}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          percentage >= 90 ? 'bg-green-100 text-green-800' :
                          percentage >= 80 ? 'bg-blue-100 text-blue-800' :
                          percentage >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {percentage.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(grade.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setEditingGrade(grade)}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                          aria-label="Edit grade"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteGrade(grade.id)}
                          className="text-red-600 hover:text-red-900"
                          aria-label="Delete grade"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    No grades found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Grade Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Grade</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddGrade(new FormData(e.currentTarget));
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
                  <label className="block text-sm font-medium text-gray-700">Assignment Name</label>
                  <input type="text" name="assignmentName" className="input-field" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Grade</label>
                    <input type="number" name="grade" step="0.1" className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Points</label>
                    <input type="number" name="maxPoints" step="0.1" className="input-field" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Weight</label>
                    <input type="number" name="weight" step="0.01" min="0" max="1" className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select name="category" className="input-field" required>
                      <option value="">Select category</option>
                      <option value="exam">Exam</option>
                      <option value="homework">Homework</option>
                      <option value="project">Project</option>
                      <option value="quiz">Quiz</option>
                      <option value="participation">Participation</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input type="date" name="date" className="input-field" required />
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
                  Add Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Grade Modal */}
      {editingGrade && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Grade</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleEditGrade(new FormData(e.currentTarget));
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assignment Name</label>
                  <input 
                    type="text" 
                    name="assignmentName" 
                    className="input-field" 
                    defaultValue={editingGrade.assignmentName}
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Grade</label>
                    <input 
                      type="number" 
                      name="grade" 
                      step="0.1" 
                      className="input-field" 
                      defaultValue={editingGrade.grade}
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Points</label>
                    <input 
                      type="number" 
                      name="maxPoints" 
                      step="0.1" 
                      className="input-field" 
                      defaultValue={editingGrade.maxPoints}
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Weight</label>
                    <input 
                      type="number" 
                      name="weight" 
                      step="0.01" 
                      min="0" 
                      max="1" 
                      className="input-field" 
                      defaultValue={editingGrade.weight}
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select name="category" className="input-field" defaultValue={editingGrade.category} required>
                      <option value="exam">Exam</option>
                      <option value="homework">Homework</option>
                      <option value="project">Project</option>
                      <option value="quiz">Quiz</option>
                      <option value="participation">Participation</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input 
                    type="date" 
                    name="date" 
                    className="input-field" 
                    defaultValue={editingGrade.date.toISOString().split('T')[0]}
                    required 
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingGrade(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
