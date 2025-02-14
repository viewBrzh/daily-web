import styles from "@/styles/view-project/sprintBoard.module.css";
import DropdownSelect from "@/components/common/drop-down/dropdownSelect";
import { SprintData, Status, Task, User } from "@/components/common/types";
import { getCurrentSprintByProject, getPersonFilterOption, getSprintByProject, getTasks, getTaskStatus } from "@/pages/api/my-task/sprint";
import React, { useEffect, useState } from "react";
import BigUserProfileIcon from "@/components/common/smallUserProfileIcon";
import SmallUserProfileIcon from "@/components/common/smallUserProfileIcon";

interface CalendarProps {
    isSprint: string;
    projectId: string;
}

const initStatus: Status = {
    statusId: 0,
    name: ""
}

const initialSprintData: SprintData = {
    sprintId: 0,
    sprintName: "",
    start_date: new Date(),
    end_date: new Date(),
    projectId: 0,
};

const initUserData: User = {
    userId: 0,
    username: "",
    fullName: "",
    empId: "",
}

const initTaskData: Task = {
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

const SprintBoard: React.FC<CalendarProps> = ({ isSprint, projectId }) => {
    if (isSprint !== "Sprint") return null;

    const [selectedSprint, setSelectedSprint] = useState<SprintData>(initialSprintData);
    const [selectedPerson, setSelectedPerson] = useState<User>(initUserData);
    const [personOption, setPersonOption] = useState<User[]>([initUserData]);
    const [sprintOption, setSprintOption] = useState<SprintData[]>([initialSprintData]);
    const [tasks, setTasks] = useState<Task[]>([initTaskData]);
    const [status, setStatus] = useState<Status[]>([initStatus]);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const status = await getTaskStatus();
                setStatus(status);
            } catch (error) {
                console.error("Error fetching status:", error);
            }
        };
        fetchStatus();
    }, [])

    useEffect(() => {
        const fetchSprint = async () => {
            try {
                const currentSprint = await getCurrentSprintByProject(projectId);
                setSelectedSprint(currentSprint);

                const dropdownSprint = await getSprintByProject(projectId);
                setSprintOption(dropdownSprint);
            } catch (error) {
                console.error("Error fetching sprints:", error);
            }
        };
        fetchSprint();
    }, [projectId]);

    useEffect(() => {
        const fetchPerson = async () => {
            try {
                const personOptionRes = await getPersonFilterOption(selectedSprint?.sprintId);
                setPersonOption(personOptionRes);
            } catch (error) {
                console.error("Error fetching persons:", error);
            }
        };
        fetchPerson();
    }, [selectedSprint]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const tasks = await getTasks(selectedSprint?.sprintId, selectedPerson?.userId);
                setTasks(tasks);
                console.log(tasks)
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        fetchTasks();
    }, [selectedSprint, selectedPerson]);

    const specialOptions = [
        { value: "all", label: "All" }
    ];

    const personOptions = [
        ...specialOptions,
        ...personOption?.map((person) => ({
            value: person.userId.toString(),
            label: person.fullName,
        }))
    ];

    const sprintOptions = sprintOption.map((sprint) => ({
        value: sprint.sprintId.toString(),
        label: sprint.sprintName,
    }));

    const handleSelectSprintChange = (selectedValue: string) => {
        const selected = sprintOption.find((sprint) => sprint.sprintId.toString() === selectedValue);
        if (selected) {
            setSelectedSprint(selected);
        }
    };

    const handleSelectPersonChange = (selectedValue: string) => {
        if (selectedValue === "all") {
            setSelectedPerson(initUserData);
        } else {
            const selected = personOption?.find((person) => person.userId.toString() === selectedValue);
            if (selected) {
                setSelectedPerson(selected);
            }
        }
    };

    const formatDate = (date: string) => {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return "Invalid date";
        }
        return new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
        }).format(parsedDate);
    };

    const getDaysCount = (startDate: string, endDate: string): number => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDifference = end.getTime() - start.getTime();
        const daysDifference = timeDifference / (1000 * 3600 * 24);
        
        return daysDifference;
    };

    const groupedTasks = status.reduce((acc, currStatus) => {
        acc[currStatus.statusId] = tasks.filter(task => task.statusId === currStatus.statusId);
        return acc;
    }, {} as { [key: number]: Task[] });

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.filterSelectContainer}>
                    <DropdownSelect
                        options={sprintOptions}
                        value={selectedSprint?.sprintId.toString()}
                        onChange={handleSelectSprintChange}
                    />
                    <DropdownSelect
                        placeholder={selectedPerson.userId === 0 ? "Person: All" : `Person: ${selectedPerson.fullName}`}
                        options={personOptions}
                        value={selectedPerson.userId === 0 ? "all" : selectedPerson.userId.toString()}
                        onChange={handleSelectPersonChange}
                    />
                </div>
                <div className={styles.manDay}>
                    {formatDate(selectedSprint?.start_date.toString())} - {formatDate(selectedSprint?.end_date.toString())} 
                    <div>{getDaysCount(selectedSprint?.start_date.toString(), selectedSprint?.end_date.toString())} work days</div>
                </div>
            </div>

            <div className={styles.taskTableContainer}>
                {status.map((statusItem) => (
                    <div key={statusItem.statusId} className={styles.statusColumn}>
                        <div className={styles.header}>{statusItem.name}</div>
                        {groupedTasks[statusItem.statusId]?.map((task) => (
                            <div key={task.taskId} className={styles.task}>
                                <div className={styles.name}><strong>{task.taskId} </strong>{task.name}</div>
                                <div className={styles.resUser}><SmallUserProfileIcon fullName={task.resUserFullName} /> <span>{task.resUserFullName}</span></div>
                                <div>Priority {task.priority}</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SprintBoard;
