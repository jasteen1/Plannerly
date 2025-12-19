'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Clock, MapPin, User, AlertCircle } from 'lucide-react';
import { Holiday, Task } from '../utils/types';
import { getTodaysTasks, getUpcomingHolidays, getOverdueTasks, getTasksDueSoon, loadFromStorage } from '../utils/helpers';
import DashboardCards from '../components/DashboardCards';
import HolidayBadge from '../components/HolidayBadge';
import TaskItem from '../components/TaskItem';

export default function DashboardPage() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [customHolidays, setCustomHolidays] = useState<Holiday[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      // Load custom holidays from localStorage
      const savedCustomHolidays = loadFromStorage<Holiday[]>('customHolidays', []);
      setCustomHolidays(savedCustomHolidays);

      // Load tasks from localStorage
      const savedTasks = loadFromStorage<Task[]>('tasks', []);
      setTasks(savedTasks);

      // Fetch official holidays for current year
      try {
        const response = await fetch(`/api/holidays?year=${new Date().getFullYear()}`);
        if (response.ok) {
          const data = await response.json();
          setHolidays(data.holidays || []);
        }
      } catch (error) {
        console.error('Failed to fetch holidays:', error);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  // Calculate dashboard data
  const todaysTasks = getTodaysTasks(tasks);
  const upcomingHolidays = getUpcomingHolidays([...holidays, ...customHolidays], 14);
  const urgentTasks = todaysTasks.filter(task => !task.completed);
  const overdueTasks = getOverdueTasks(tasks);
  const tasksDueSoon = getTasksDueSoon(tasks, 24);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const officialHolidays = holidays.length;
  const userHolidays = customHolidays.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome to Plannerly</h1>
              <p className="text-gray-600">Manage your tasks and stay on top of holidays</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{todaysTasks.length}</p>
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-lg shadow-sm p-6 ${overdueTasks.length > 0 ? 'ring-2 ring-red-500' : ''}`}>
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{overdueTasks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Official Holidays</p>
                <p className="text-2xl font-bold text-gray-900">{officialHolidays}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Custom Holidays</p>
                <p className="text-2xl font-bold text-gray-900">{userHolidays}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-4 mb-8">
          {/* Overdue Tasks Alert */}
          {overdueTasks.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Overdue Tasks</h3>
                  <p className="text-sm text-red-700 mt-1">
                    You have {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''} that need immediate attention.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tasks Due Soon Alert */}
          {tasksDueSoon.length > 0 && overdueTasks.length === 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-orange-800">Tasks Due Soon</h3>
                  <p className="text-sm text-orange-700 mt-1">
                    You have {tasksDueSoon.length} task{tasksDueSoon.length > 1 ? 's' : ''} due within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Urgent Tasks Alert */}
          {urgentTasks.length > 0 && overdueTasks.length === 0 && tasksDueSoon.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Tasks Due Today</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    You have {urgentTasks.length} unfinished task{urgentTasks.length > 1 ? 's' : ''} due today.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Today's Tasks and Upcoming Holidays */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Today's Tasks */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Today's Tasks
            </h2>
            {todaysTasks.length > 0 ? (
              <div className="space-y-3">
                {todaysTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={() => {
                      setTasks(prev => prev.map(t =>
                        t.id === task.id ? { ...t, completed: !t.completed } : t
                      ));
                    }}
                    onDelete={() => {
                      setTasks(prev => prev.filter(t => t.id !== task.id));
                    }}
                    showDate={false}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No tasks scheduled for today. Great job staying on top of things!
              </p>
            )}
          </div>

          {/* Upcoming Holidays */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Upcoming Holidays
            </h2>
            {upcomingHolidays.length > 0 ? (
              <div className="space-y-2">
                {upcomingHolidays.map(holiday => (
                  <HolidayBadge key={holiday.id} holiday={holiday} compact />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No holidays coming up in the next two weeks.
              </p>
            )}
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Navigation</h2>
          <DashboardCards />
        </div>
      </div>
    </div>
  );
}
