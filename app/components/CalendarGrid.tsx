import React from 'react';
import { Holiday, Task } from '../utils/types';
import { formatDate, getDaysInMonth, getFirstDayOfMonth } from '../utils/helpers';
import DayCell from './DayCell';

interface CalendarGridProps {
  currentDate: Date;
  holidays: Holiday[];
  tasks: Task[];
  onDayClick: (date: Date) => void;
  onDeleteHoliday: (holidayId: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function CalendarGrid({
  currentDate,
  holidays,
  tasks,
  onDayClick,
  onDeleteHoliday,
  onToggleTask,
  onDeleteTask
}: CalendarGridProps) {
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const today = new Date();

  const renderCalendarDays = () => {
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
          holidays={holidays}
          tasks={tasks}
          isCurrentMonth={false}
          isToday={false}
          onClick={() => onDayClick(date)}
          onDeleteHoliday={onDeleteHoliday}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
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
          holidays={holidays}
          tasks={tasks}
          isCurrentMonth={true}
          isToday={isToday}
          onClick={() => onDayClick(date)}
          onDeleteHoliday={onDeleteHoliday}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
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
          holidays={holidays}
          tasks={tasks}
          isCurrentMonth={false}
          isToday={false}
          onClick={() => onDayClick(date)}
          onDeleteHoliday={onDeleteHoliday}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
        />
      );
    }

    return days;
  };

  return (
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
        {renderCalendarDays()}
      </div>
    </div>
  );
}
