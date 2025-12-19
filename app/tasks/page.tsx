'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, Edit } from 'lucide-react';
import { Task } from '../utils/types';
import { loadFromStorage, saveToStorage, filterTasksByPeriod } from '../utils/helpers';
import TaskItem from '../components/TaskItem';
import AddTaskForm from '../components/AddTaskForm';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = loadFromStorage<Task[]>('tasks', []);
    setTasks(savedTasks);
  }, []);

  // Save to localStorage when tasks change
  useEffect(() => {
    saveToStorage('tasks', tasks);
  }, [tasks]);

  // Filter and search tasks
  useEffect(() => {
    let filtered = tasks;

    // Apply period filter
    if (filter !== 'all') {
      filtered = filterTasksByPeriod(tasks, filter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply completed filter
    if (!showCompleted) {
      filtered = filtered.filter(task => !task.completed);
    }

    // Sort by date and completion status
    filtered.sort((a, b) => {
      // Completed tasks go to bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Then sort by date
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    setFilteredTasks(filtered);
  }, [tasks, filter, searchTerm, showCompleted]);

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

  const updateTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    if (!editingTask) return;

    setTasks(prev => prev.map(task =>
      task.id === editingTask.id
        ? { ...task, ...taskData }
        : task
    ));
    setEditingTask(null);
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    today: filterTasksByPeriod(tasks, 'today').length,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="card rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Tasks</h1>
            <button
              onClick={() => setShowAddTask(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Tasks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.today}</p>
              <p className="text-sm text-gray-600">Due Today</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: 'var(--border-primary)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Tasks</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show Completed</span>
              </label>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => deleteTask(task.id)}
                onEdit={() => startEditing(task)}
              />
            ))
          ) : (
            <div className="card rounded-lg shadow-sm p-12 text-center">
              <div className="text-muted mb-4">
                <Filter className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>No tasks found</h3>
              <p className="text-secondary">
                {searchTerm || filter !== 'all' || !showCompleted
                  ? 'Try adjusting your filters or search terms.'
                  : 'Get started by adding your first task!'}
              </p>
            </div>
          )}
        </div>

        {/* Modals */}
        {showAddTask && (
          <AddTaskForm
            onAdd={addTask}
            onClose={() => setShowAddTask(false)}
          />
        )}

        {editingTask && (
          <AddTaskForm
            onAdd={updateTask}
            onClose={() => setEditingTask(null)}
            initialData={editingTask}
          />
        )}
      </div>
    </div>
  );
}
