export interface Project {
  project_code: string;
  project_id: number;
  name: string;
  description: string;
  role: string;
  last_update: string;
  status: string;
  members: number;
  task: number;
}

export interface MyProjectPage {
  projects: Project[];
  total_page: number;
  total_row: number;
}

export interface NewProject {
  project_code: string;
  name: string;
  description: string;
  start_date: Date;
  end_date: Date;
}

export interface UpdateProject {
  project_id: number;
  project_code: string;
  name: string;
  description: string;
  start_date: Date;
  end_date: Date;
  status: string;
}

export interface Member {
  full_name: string;
  user_id: number;
  role: string;
}

export interface User {
  user_id: number;
  email: string;
  full_name: string;
  emp_id: string;
}

export interface Task {
task_id: number;
name: string;
description: string;
status_id: number;
res_user_id: number;
sprint_id: number;
project_id: number;
res_user_full_name: string;
priority: number;
}

export interface ViewProject {
  project_code: string;
  project_id: number;
  name: string;
  description: string;
  last_update: Date;
  status: string;
  start_date: Date;
  end_date: Date;
}

export interface CalendarItem {
  project_id?: number;
  id: number;
  date: string; 
  title: string;
  description: string;
  created_by: number;
  location: string;
}

interface SprintProgress {
sprint_name: string;
total_tasks: number;
status_count: {
  [status: string]: number; // Key-value pairs where key is the status (e.g., "Done") and value is the count
};
}

interface TaskStatus {
status: string;
count: number;
}

interface MemberChartData {
role: string;
count: number;
}

export interface DashboardData {
task_status: TaskStatus[];
sprint_progress: SprintProgress[];
members: MemberChartData[];
}

export interface SprintData {
sprint_id: number;
start_date: Date;
end_date: Date;
sprint_name: string;
project_id: string;
}

export const sprintToRecord = (sprint: SprintData): Record<string, string> => {
const formatDate = (date: Date | string) =>
  date instanceof Date
    ? date.toISOString().split('T')[0] // Convert Date to 'YYYY-MM-DD'
    : new Date(date).toISOString().split('T')[0]; // Convert string to Date first

return {
  sprint_id: sprint?.sprint_id?.toString(),
  start_date: sprint ? formatDate(sprint?.start_date) : '',
  end_date: sprint ? formatDate(sprint?.end_date) : '',
  sprint_name: sprint?.sprint_name,
  project_id: sprint?.project_id?.toString(),
};
};

export interface SprintDataInsert {
start_date: Date;
end_date: Date;
sprint_name: string;
project_id: string;
}

export interface Status {
status_id: number;
name: string;
}

export interface Field {
name: string;
label: string;
type?: string;
placeholder?: string;
required?: boolean;
}

export interface SelectModalProps {
show: boolean;
position: { x: number; y: number };
onClose: () => void;
onUpdate: () => void;
onDelete: () => void;
}

export const initTaskData: Task = {
task_id: 0,
name: "",
description: "",
status_id: 0,
res_user_id: 0,
sprint_id: 0,
project_id: 0,
res_user_full_name: "",
priority: 1,
}