// Types for the Student Planner app

export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: string;
  description?: string;
  isOfficial: boolean;
}

export interface Task {
  id: string;
  title: string;
  date: string;
  deadline?: string; // Optional deadline date
  description?: string;
  completed: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  upcomingHolidays: number;
  officialHolidays: number;
  customHolidays: number;
}
