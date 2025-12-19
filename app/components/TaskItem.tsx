import React from 'react';
import { CheckCircle2, Circle, Trash2, Clock, Edit, AlertTriangle, Calendar } from 'lucide-react';
import { Task } from '../utils/types';
import { formatDateShort } from '../utils/helpers';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onEdit?: () => void;
  showDate?: boolean;
  compact?: boolean;
}

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
  showDate = true,
  compact = false
}: TaskItemProps) {
  const now = new Date();
  const taskDate = new Date(task.date);
  const deadlineDate = task.deadline ? new Date(task.deadline) : null;
  const isOverdue = deadlineDate && deadlineDate < now && !task.completed;
  const isDueSoon = deadlineDate && deadlineDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000) && !task.completed;

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg mb-1">
        <button onClick={onToggle} className="flex-shrink-0">
          {task.completed ? (
            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
          ) : (
            <Circle className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium truncate ${
            task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
          }`}>
            {task.title}
          </h4>
          {deadlineDate && !task.completed && (
            <div className="flex items-center gap-1 mt-1">
              <Clock className={`w-3 h-3 ${isOverdue ? 'text-red-500 dark:text-red-400' : isDueSoon ? 'text-orange-500 dark:text-orange-400' : 'text-gray-400 dark:text-gray-500'}`} />
              <span className={`text-xs ${isOverdue ? 'text-red-600 dark:text-red-400' : isDueSoon ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400'}`}>
                Due {formatDateShort(deadlineDate)}
              </span>
            </div>
          )}
        </div>
        <button onClick={onDelete} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex-shrink-0">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white border rounded-xl p-5 hover:shadow-lg transition-all duration-200 ${
      isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'
    }`}>
      <div className="flex items-start gap-4">
        <button
          onClick={onToggle}
          className="mt-1 flex-shrink-0 hover:scale-110 transition-transform"
        >
          {task.completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : (
            <Circle className="w-6 h-6 text-gray-400 hover:text-gray-600" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`text-lg font-semibold ${
                  task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}>
                  {task.title}
                </h3>
                {isOverdue && (
                  <div className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                    <AlertTriangle className="w-3 h-3" />
                    Overdue
                  </div>
                )}
                {isDueSoon && !isOverdue && (
                  <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                    <Clock className="w-3 h-3" />
                    Due Soon
                  </div>
                )}
              </div>

              {task.description && (
                <p className={`text-sm mt-2 leading-relaxed ${
                  task.completed ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {task.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1 ml-4">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit task"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onDelete}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Date and Deadline Info */}
          {showDate && (
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
              <div className="flex items-center gap-1 text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Start: {formatDateShort(taskDate)}</span>
              </div>

              {deadlineDate && (
                <div className={`flex items-center gap-1 ${
                  isOverdue ? 'text-red-600' :
                  isDueSoon ? 'text-orange-600' : 'text-gray-500'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span>Due: {formatDateShort(deadlineDate)}</span>
                </div>
              )}

              {!deadlineDate && (
                <div className="flex items-center gap-1 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>No deadline</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
