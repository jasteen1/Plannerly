'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Holiday, Task } from '../utils/types';
import { loadFromStorage, saveToStorage } from '../utils/helpers';
import CalendarGrid from '../components/CalendarGrid';
import AddHolidayForm from '../components/AddHolidayForm';
import AddTaskForm from '../components/AddTaskForm';
import DayDetailsModal from '../components/DayDetailsModal';

export default function PlannerPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [customHolidays, setCustomHolidays] = useState<Holiday[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddHoliday, setShowAddHoliday] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCustomHolidays = loadFromStorage<Holiday[]>('customHolidays', []);
    const savedTasks = loadFromStorage<Task[]>('tasks', []);

    setCustomHolidays(savedCustomHolidays);
    setTasks(savedTasks);
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    saveToStorage('customHolidays', customHolidays);
  }, [customHolidays]);

  useEffect(() => {
    saveToStorage('tasks', tasks);
  }, [tasks]);

  // Fetch official holidays when year changes
  useEffect(() => {
    const fetchHolidays = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/holidays?year=${currentDate.getFullYear()}`);
        if (response.ok) {
          const data = await response.json();
          setHolidays(data.holidays || []);
        }
      } catch (error) {
        console.error('Failed to fetch holidays:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, [currentDate.getFullYear()]);

  // Merge official and custom holidays
  const allHolidays = [...holidays, ...customHolidays];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const addCustomHoliday = (holidayData: Omit<Holiday, 'id' | 'isOfficial'>) => {
    const newHoliday: Holiday = {
      ...holidayData,
      id: `custom-${Date.now()}`,
      isOfficial: false,
    };
    setCustomHolidays(prev => [...prev, newHoliday]);
    setShowAddHoliday(false);
  };

  const deleteCustomHoliday = (holidayId: string) => {
    setCustomHolidays(prev => prev.filter(h => h.id !== holidayId));
  };

  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
    setShowAddTask(false);
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="card rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-md transition-colors hover:opacity-75"
                style={{ backgroundColor: 'var(--bg-hover)' }}
              >
                <ChevronLeft className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
              </button>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h1>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-md transition-colors hover:opacity-75"
                style={{ backgroundColor: 'var(--bg-hover)' }}
              >
                <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddHoliday(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Holiday
              </button>
              <button
                onClick={() => setShowAddTask(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--bg-hover)' }}></div>
              <span style={{ color: 'var(--text-secondary)' }}>Official Holidays</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--bg-hover)' }}></div>
              <span style={{ color: 'var(--text-secondary)' }}>Custom Holidays</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-200 rounded"></div>
              <span style={{ color: 'var(--text-secondary)' }}>Tasks</span>
            </div>
          </div>
        </div>

        {/* Calendar */}
        {loading ? (
          <div className="card rounded-lg shadow-sm p-8 text-center">
            <div className="text-secondary">Loading holidays...</div>
          </div>
        ) : (
          <CalendarGrid
            currentDate={currentDate}
            holidays={allHolidays}
            tasks={tasks}
            onDayClick={setSelectedDate}
            onDeleteHoliday={deleteCustomHoliday}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />
        )}

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card rounded-lg shadow-sm p-4">
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Official Holidays</h3>
            <p className="text-2xl font-bold text-blue-600">{holidays.length}</p>
          </div>
          <div className="card rounded-lg shadow-sm p-4">
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Custom Holidays</h3>
            <p className="text-2xl font-bold text-green-600">{customHolidays.length}</p>
          </div>
          <div className="card rounded-lg shadow-sm p-4">
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Active Tasks</h3>
            <p className="text-2xl font-bold text-orange-600">
              {tasks.filter(t => !t.completed).length}
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddHoliday && (
        <AddHolidayForm
          onAdd={addCustomHoliday}
          onClose={() => setShowAddHoliday(false)}
        />
      )}

      {showAddTask && (
        <AddTaskForm
          onAdd={addTask}
          onClose={() => setShowAddTask(false)}
        />
      )}

      {selectedDate && (
        <DayDetailsModal
          date={selectedDate}
          holidays={allHolidays}
          tasks={tasks}
          onClose={() => setSelectedDate(null)}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onDeleteHoliday={deleteCustomHoliday}
        />
      )}
    </div>
  );
}
