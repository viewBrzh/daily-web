import Calendar from "@/components/common/calendar/calendar";
import React from "react";

interface CalendarProps {
    projectId: string;
}

const ProjectCalendar: React.FC<CalendarProps> = ({ }) => {

    return (
        <Calendar />
    );
}

export default ProjectCalendar;
