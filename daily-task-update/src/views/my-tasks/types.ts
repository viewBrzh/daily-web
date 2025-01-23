export interface Project {
    projectId: number;
    title: string;
    description: string;
    role: string;
    lastUpdate: string;
    status: string;
}

export interface NewProject {
    title: string;
    description: string;
    lastUpdate: string;
    status: string;
}