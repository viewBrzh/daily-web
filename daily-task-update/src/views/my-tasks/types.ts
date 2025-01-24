export interface Project {
    projectCode: string;
    projectId: number;
    name: string;
    description: string;
    role: string;
    lastUpdate: string;
    status: string;
}

export interface NewProject {
    projectCode: string;
    name: string;
    description: string;
    start_date: Date;
    end_date: Date;
}