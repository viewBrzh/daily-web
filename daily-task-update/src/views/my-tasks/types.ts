export interface Project {
    projectId: number;
    title: string;
    lastUpdate: string;
    status: string;
}

export interface NewProject {
    title: string;
    lastUpdate: string;
    status: string;
}