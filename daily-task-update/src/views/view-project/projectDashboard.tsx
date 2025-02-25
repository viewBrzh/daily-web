import DashboardCharts from "@/components/common/chart/dashboardCharts";
import { DashboardData } from "@/components/common/types";
import { getProjectDashboard } from "@/pages/api/my-task/dashboard";
import React, { useEffect, useState } from "react";

interface CalendarProps {
    isDashboard: string;
    projectId: string;
}

const initData: DashboardData = {
    taskStatus: [
        { status: "Done", count: 0 },
        { status: "In-Progress", count: 0 },
        { status: "New", count: 0 },
        { status: "Pending", count: 0 }
    ],
    sprintProgress: [
        {
            sprintName: "",
            totalTasks: 0,
            statusCount: {
                "Done": 0,
                "In-Progress": 0,
                "Pending": 0,
                "New": 0
            }
        }
    ],
    members: [
        { role: "", count: 0 }
    ]
};

const ProjectDashboard: React.FC<CalendarProps> = ({ isDashboard, projectId }) => {
    const [dashboardData, setDashboardData] = useState<DashboardData>(initData);

    useEffect(() => {
        if (isDashboard !== "Dashboard") return;  // Conditional check inside useEffect only

        const fetchData = async () => {
            try {
                const res = await getProjectDashboard(projectId);
                setDashboardData(res);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchData();
    }, [isDashboard, projectId]);  // Depend on `isDashboard` and `projectId`

    if (isDashboard !== "Dashboard") return null;  // Early return based on the condition

    return (
        <DashboardCharts data={dashboardData} />
    );
}

export default ProjectDashboard;
