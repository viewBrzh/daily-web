import Calendar from "@/components/common/calendar/calendar";
import React, { useEffect, useState } from "react";

interface CalendarProps {
    isCalendar: string;
    projectId: string;
}


const ProjectCalendar: React.FC<CalendarProps> = ({ isCalendar, projectId }) => {
    if (isCalendar !== "Calendar") return null;

    return (
        <Calendar/>
    );
}

export default ProjectCalendar;