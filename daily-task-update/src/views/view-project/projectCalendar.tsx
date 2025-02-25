import Calendar from "@/components/common/calendar/calendar";
import React from "react";

interface CalendarProps {
    isCalendar: string;
    projectId: string;
}

const ProjectCalendar: React.FC<CalendarProps> = ({ isCalendar }) => {
    if (isCalendar !== "Calendar") return null;

    return (
        <Calendar />
    );
}

export default ProjectCalendar;
