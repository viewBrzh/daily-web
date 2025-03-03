import DashboardCharts from "@/components/common/chart/dashboardCharts";
import LoadingModal from "@/components/common/loadingModa";
import { DashboardData } from "@/components/common/types";
import { getProjectDashboard } from "@/pages/api/my-task/dashboard";
import React, { useEffect, useState } from "react";

interface CalendarProps {
    projectId: string;
}

const initData: DashboardData = {
    task_status: [
        { status: "Done", count: 0 },
        { status: "In-Progress", count: 0 },
        { status: "New", count: 0 },
        { status: "Pending", count: 0 }
    ],
    sprint_progress: [
        {
            sprint_name: "",
            total_tasks: 0,
            status_count: {
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

const ProjectDashboard: React.FC<CalendarProps> = ({ projectId }) => {
    const [dashboardData, setDashboardData] = useState<DashboardData>(initData);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await getProjectDashboard(projectId);
                setDashboardData(res);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [projectId]);

    return (
        <>
            <DashboardCharts data={dashboardData} />
            <LoadingModal isLoading={isLoading} />
        </>

    );
}

export default ProjectDashboard;
