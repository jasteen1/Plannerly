'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  CheckCircle2,
  Circle,
  Trash2,
  Star,
  Clock,
  MapPin,
  X
} from 'lucide-react';

// Types
interface Holiday {
  id: string;
  name: string;
  date: string;
  type: string;
  description?: string;
  isOfficial: boolean;
}

interface Task {
  id: string;
  title: string;
  date: string;
  description?: string;
  completed: boolean;
  createdAt: string;
}

// Utility functions
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const parseDate = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00');
};

const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getFirstDayOfMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

// Components
const HolidayBadge: React.FC<{ holiday: Holiday; onDelete?: () => void }> = ({ holiday, onDelete }) => {
  const bgColor = holiday.isOfficial ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  const icon = holiday.isOfficial ? <Star className="w-3 h-3" /> : <MapPin className="w-3 h-3" />;

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgColor} mr-1 mb-1`}>
      {icon}
      <span className="truncate max-w-20">{holiday.name}</span>
      {!holiday.isOfficial && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="ml-1 hover:text-red-600"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

const TaskItem: React.FC<{ task: Task; onToggle: () => void; onDelete: () => void }> = ({ task, onToggle, onDelete }) => {
  return (
    <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg mb-1">
      <button onClick={onToggle} className="mt-0.5">
        {task.completed ? (
          <CheckCircle2 className="w-4 h-4 text-green-600" />
        ) : (
          <Circle className="w-4 h-4 text-gray-400" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
          {task.title}
        </h4>
        {task.description && (
          <p className={`text-xs mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
            {task.description}
          </p>
        )}
      </div>
      <button onClick={onDelete} className="text-red-500 hover:text-red-700">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

const DayCell: React.FC<{
  date: Date;
  holidays: Holiday[];
  tasks: Task[];
  isCurrentMonth: boolean;
  isToday: boolean;
  onClick: () => void;
  onDeleteHoliday: (holidayId: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}> = ({
  date,
  holidays,
  tasks,
  isCurrentMonth,
  isToday,
  onClick,
  onDeleteHoliday,
  onToggleTask,
  onDeleteTask
}) => {
  const dayHolidays = holidays.filter(h => h.date === formatDate(date));
  const dayTasks = tasks.filter(t => t.date === formatDate(date));

  const hasHolidays = dayHolidays.length > 0;
  const hasTasks = dayTasks.length > 0;

  return (
    <div
      className={`
        min-h-[120px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors
        ${!isCurrentMonth ? 'bg-gray-100 text-gray-400' : 'bg-white'}
        ${isToday ? 'ring-2 ring-blue-500 ring-inset' : ''}
        ${hasHolidays ? 'bg-blue-50' : ''}
      `}
      onClick={onClick}
    >
      <div className="text-sm font-medium mb-1">
        {date.getDate()}
      </div>

      {/* Holidays */}
      {dayHolidays.length > 0 && (
        <div className="mb-2">
          {dayHolidays.slice(0, 2).map(holiday => (
            <HolidayBadge
              key={holiday.id}
              holiday={holiday}
              onDelete={!holiday.isOfficial ? () => onDeleteHoliday(holiday.id) : undefined}
            />
          ))}
          {dayHolidays.length > 2 && (
            <div className="text-xs text-gray-500">+{dayHolidays.length - 2} more</div>
          )}
        </div>
      )}

      {/* Tasks */}
      {dayTasks.length > 0 && (
        <div>
          {dayTasks.slice(0, 2).map(task => (
            <div key={task.id} className="flex items-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-orange-500" />
              <span className={`text-xs truncate ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {task.title}
              </span>
            </div>
          ))}
          {dayTasks.length > 2 && (
            <div className="text-xs text-gray-500">+{dayTasks.length - 2} tasks</div>
          )}
        </div>
      )}
    </div>
  );
};

const AddHolidayForm: React.FC<{ onAdd: (holiday: Omit<Holiday, 'id' | 'isOfficial'>) => void; onClose: () => void }> = ({ onAdd, onClose }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('Festival');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && date) {
      onAdd({ name, date, type, description: '' });
      setName('');
      setDate('');
      setType('Festival');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Add Custom Holiday</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Holiday Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Festival">Festival</option>
              <option value="School Event">School Event</option>
              <option value="Personal">Personal</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Holiday
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddTaskForm: React.FC<{ onAdd: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void; onClose: () => void }> = ({ onAdd, onClose }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && date) {
      onAdd({ title, date, description });
      setTitle('');
      setDate('');
      setDescription('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Add Task</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Add Task
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DayDetailsModal: React.FC<{
  date: Date | null;
  holidays: Holiday[];
  tasks: Task[];
  onClose: () => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteHoliday: (holidayId: string) => void;
}> = ({ date, holidays, tasks, onClose, onToggleTask, onDeleteTask, onDeleteHoliday }) => {
  if (!date) return null;

  const dayHolidays = holidays.filter(h => h.date === formatDate(date));
  const dayTasks = tasks.filter(t => t.date === formatDate(date));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Holidays */}
        {dayHolidays.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Holidays
            </h4>
            {dayHolidays.map(holiday => (
              <div key={holiday.id} className="mb-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-medium">{holiday.name}</h5>
                    <p className="text-sm text-gray-600">{holiday.type}</p>
                    {holiday.description && (
                      <p className="text-sm text-gray-500 mt-1">{holiday.description}</p>
                    )}
                  </div>
                  {!holiday.isOfficial && (
                    <button
                      onClick={() => onDeleteHoliday(holiday.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tasks */}
        {dayTasks.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Tasks
            </h4>
            {dayTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => onToggleTask(task.id)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
          </div>
        )}

        {dayHolidays.length === 0 && dayTasks.length === 0 && (
          <p className="text-gray-500 text-center py-8">No events or tasks for this day</p>
        )}
      </div>
    </div>
  );
};

export default function StudentPlannerPage() {
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
    const savedCustomHolidays = localStorage.getItem('customHolidays');
    const savedTasks = localStorage.getItem('tasks');

    if (savedCustomHolidays) {
      setCustomHolidays(JSON.parse(savedCustomHolidays));
    }

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('customHolidays', JSON.stringify(customHolidays));
  }, [customHolidays]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
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

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const today = new Date();

    const days = [];

    // Previous month days
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(currentDate.getMonth() - 1);
    const daysInPrevMonth = getDaysInMonth(prevMonth);

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, daysInPrevMonth - i);
      days.push(
        <DayCell
          key={`prev-${i}`}
          date={date}
          holidays={allHolidays}
          tasks={tasks}
          isCurrentMonth={false}
          isToday={false}
          onClick={() => setSelectedDate(date)}
          onDeleteHoliday={deleteCustomHoliday}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
        />
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = date.toDateString() === today.toDateString();

      days.push(
        <DayCell
          key={day}
          date={date}
          holidays={allHolidays}
          tasks={tasks}
          isCurrentMonth={true}
          isToday={isToday}
          onClick={() => setSelectedDate(date)}
          onDeleteHoliday={deleteCustomHoliday}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
        />
      );
    }

    // Next month days to fill the grid
    const remainingCells = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i);
      days.push(
        <DayCell
          key={`next-${i}`}
          date={date}
          holidays={allHolidays}
          tasks={tasks}
          isCurrentMonth={false}
          isToday={false}
          onClick={() => setSelectedDate(date)}
          onDeleteHoliday={deleteCustomHoliday}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
        />
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h1>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
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
              <div className="w-4 h-4 bg-blue-100 rounded"></div>
              <span>Official Holidays</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 rounded"></div>
              <span>Custom Holidays</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>Tasks</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-500">Loading holidays...</div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Days of week header */}
            <div className="grid grid-cols-7 bg-gray-50 border-b">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-4 text-center font-semibold text-gray-700">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7">
              {renderCalendar()}
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold mb-2">Official Holidays</h3>
            <p className="text-2xl font-bold text-blue-600">{holidays.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold mb-2">Custom Holidays</h3>
            <p className="text-2xl font-bold text-green-600">{customHolidays.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold mb-2">Active Tasks</h3>
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
