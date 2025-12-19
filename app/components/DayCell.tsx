import React from 'react';
import { Holiday, Task } from '../utils/types';
import { formatDate, parseDate } from '../utils/helpers';
import HolidayBadge from './HolidayBadge';
import { Clock } from 'lucide-react';

interface DayCellProps {
  date: Date;
  holidays: Holiday[];
  tasks: Task[];
  isCurrentMonth: boolean;
  isToday: boolean;
  onClick: () => void;
  onDeleteHoliday: (holidayId: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function DayCell({
  date,
  holidays,
  tasks,
  isCurrentMonth,
  isToday,
  onClick,
  onDeleteHoliday,
  onToggleTask,
  onDeleteTask
}: DayCellProps) {
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
              compact
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
}
