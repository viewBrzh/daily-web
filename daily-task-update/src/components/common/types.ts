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
    status: string;
    resUserId: number;
    sprintId: number;
    projectId: number;
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
    id: number;
    date: string; 
    title: string;
    description: string;
    created_by: string;
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