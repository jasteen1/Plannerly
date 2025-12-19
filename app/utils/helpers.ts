import { Holiday, Task } from './types';

// Date utility functions
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00');
};

export const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getFirstDayOfMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

export const formatDateDisplay = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

// Holiday utility functions
export const getUpcomingHolidays = (holidays: Holiday[], days: number = 14): Holiday[] => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);

  return holidays
    .filter(holiday => {
      const holidayDate = parseDate(holiday.date);
      return holidayDate >= today && holidayDate <= futureDate;
    })
    .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())
    .slice(0, 5); // Limit to 5 upcoming holidays
};

// Task utility functions
export const getTodaysTasks = (tasks: Task[]): Task[] => {
  const today = formatDate(new Date());
  return tasks.filter(task => task.date === today);
};

export const getUpcomingTasks = (tasks: Task[], days: number = 7): Task[] => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);

  return tasks
    .filter(task => {
      const taskDate = parseDate(task.date);
      return taskDate >= today && taskDate <= futureDate && !task.completed;
    })
    .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime());
};

export const getOverdueTasks = (tasks: Task[]): Task[] => {
  const now = new Date();
  return tasks.filter(task =>
    task.deadline &&
    parseDate(task.deadline) < now &&
    !task.completed
  );
};

export const getTasksDueSoon = (tasks: Task[], hours: number = 24): Task[] => {
  const now = new Date();
  const futureTime = new Date(now.getTime() + hours * 60 * 60 * 1000);

  return tasks.filter(task =>
    task.deadline &&
    parseDate(task.deadline) <= futureTime &&
    parseDate(task.deadline) >= now &&
    !task.completed
  );
};

// Filter tasks by period
export const filterTasksByPeriod = (tasks: Task[], period: 'today' | 'week' | 'month'): Task[] => {
  const now = new Date();
  const today = formatDate(now);

  switch (period) {
    case 'today':
      return tasks.filter(task => task.date === today);

    case 'week': {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)

      return tasks.filter(task => {
        const taskDate = parseDate(task.date);
        return taskDate >= weekStart && taskDate <= weekEnd;
      });
    }

    case 'month': {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      return tasks.filter(task => {
        const taskDate = parseDate(task.date);
        return taskDate >= monthStart && taskDate <= monthEnd;
      });
    }

    default:
      return tasks;
  }
};

// Storage utilities
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};
