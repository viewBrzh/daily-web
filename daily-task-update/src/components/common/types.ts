export interface Project {
    projectCode: string;
    projectId: number;
    name: string;
    description: string;
    role: string;
    lastUpdate: string;
    status: string;
    members: number;
    task: number;
}

export interface MyProjectPage {
    projects: Project[];
    totalPage: number;
    totalRow: number;
}

export interface NewProject {
    projectCode: string;
    name: string;
    description: string;
    start_date: Date;
    end_date: Date;
}

export interface UpdateProject {
    projectId: number;
    projectCode: string;
    name: string;
    description: string;
    start_date: Date;
    end_date: Date;
    status: string;
}

export interface Member {
    fullName: string;
    userId: number;
    role: string;
}

export interface User {
    userId: number;
    username: string;
    fullName: string;
    empId: string;
}

export interface Task {
  taskId: number;
  name: string;
  description: string;
  statusId: number;
  resUserId: number;
  sprintId: number;
  projectId: number;
  resUserFullName: string;
  priority: number;
}

export interface ViewProject {
    projectCode: string;
    projectId: number;
    name: string;
    description: string;
    lastUpdate: Date;
    status: string;
    start_date: Date;
    end_date: Date;
}

export interface CalendarItem {
    projectId?: number;
    id: number;
    date: string; 
    title: string;
    description: string;
    created_by: number;
    location: string;
}

interface SprintProgress {
  sprintName: string;
  totalTasks: number;
  statusCount: {
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
  taskStatus: TaskStatus[];
  sprintProgress: SprintProgress[];
  members: MemberChartData[];
}

export interface SprintData {
  sprintId: number;
  start_date: Date;
  end_date: Date;
  sprintName: string;
  projectId: string;
}

export const sprintToRecord = (sprint: SprintData): Record<string, string> => {
  const formatDate = (date: Date | string) =>
    date instanceof Date
      ? date.toISOString().split('T')[0] // Convert Date to 'YYYY-MM-DD'
      : new Date(date).toISOString().split('T')[0]; // Convert string to Date first

  return {
    sprintId: sprint?.sprintId?.toString(),
    start_date: sprint ? formatDate(sprint?.start_date) : '',
    end_date: sprint ? formatDate(sprint?.end_date) : '',
    sprintName: sprint?.sprintName,
    projectId: sprint?.projectId?.toString(),
  };
};

export interface SprintDataInsert {
  start_date: Date;
  end_date: Date;
  sprintName: string;
  projectId: string;
}

export interface Status {
  statusId: number;
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
  taskId: 0,
  name: "",
  description: "",
  statusId: 0,
  resUserId: 0,
  sprintId: 0,
  projectId: 0,
  resUserFullName: "",
  priority: 1,
}