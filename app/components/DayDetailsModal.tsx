import React from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { Holiday, Task } from '../utils/types';
import { formatDateDisplay } from '../utils/helpers';
import HolidayBadge from './HolidayBadge';
import TaskItem from './TaskItem';

interface DayDetailsModalProps {
  date: Date | null;
  holidays: Holiday[];
  tasks: Task[];
  onClose: () => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteHoliday: (holidayId: string) => void;
}

export default function DayDetailsModal({
  date,
  holidays,
  tasks,
  onClose,
  onToggleTask,
  onDeleteTask,
  onDeleteHoliday
}: DayDetailsModalProps) {
  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!date) return null;

  const dayHolidays = holidays.filter(h => h.date === date.toISOString().split('T')[0]);
  const dayTasks = tasks.filter(t => t.date === date.toISOString().split('T')[0]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/70 via-gray-800/60 to-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {formatDateDisplay(date)}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Holidays */}
        {dayHolidays.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Holidays ({dayHolidays.length})
            </h4>
            <div className="space-y-2">
              {dayHolidays.map(holiday => (
                <HolidayBadge
                  key={holiday.id}
                  holiday={holiday}
                  onDelete={!holiday.isOfficial ? () => onDeleteHoliday(holiday.id) : undefined}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tasks */}
        {dayTasks.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              Tasks ({dayTasks.length})
            </h4>
            <div className="space-y-2">
              {dayTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => onToggleTask(task.id)}
                  onDelete={() => onDeleteTask(task.id)}
                  showDate={false}
                />
              ))}
            </div>
          </div>
        )}

        {dayHolidays.length === 0 && dayTasks.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No events or tasks for this day</p>
          </div>
        )}
      </div>
    </div>
  );
}
