import styles from "@/styles/view-project/sprintBoard.module.css";
import DropdownSelect from "@/components/common/drop-down/dropdownSelect";
import { SprintData, Status, Task, User } from "@/components/common/types";
import { getCurrentSprintByProject, getPersonFilterOption, getSprintByProject, getTasks, getTaskStatus, updateTaskStatus } from "@/pages/api/my-task/sprint";
import React, { useEffect, useState } from "react";
import SmallUserProfileIcon from "@/components/common/smallUserProfileIcon";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import DragDropTaskColumn from "@/components/common/DragDropTaskColumn";

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
    const [draggingColumn, setDraggingColumn] = useState<string | null>(null);

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
        if (!selectedSprint) return;
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
        if (!selectedSprint) return;
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
        { value: "all", label: "Person: All" }
    ];

    const personOptions = [
        ...specialOptions,
        ...personOption?.map((person) => ({
            value: person.userId.toString(),
            label: person.fullName,
        }))
    ];

    const specialSprintOptions = [
        { value: "newSprint", label: "+ New Sprint" }
    ];

    const sprintOptions = [
        ...sprintOption.map((sprint) => ({
            value: sprint.sprintId.toString(),
            label: sprint.sprintName,
        })),

        ...specialSprintOptions,
    ];

    const handleNewSprint = () => {
        console.log('New Sprint option clicked');
    };
    
    const handleSelectSprintChange = (selectedValue: string) => {
        if (selectedValue === "newSprint") {
            handleNewSprint();
        } else {
            const selected = sprintOption.find((sprint) => sprint.sprintId.toString() === selectedValue);
            if (selected) {
                setSelectedSprint(selected);
            }
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

    const handleDragUpdate = (update: any) => {
        // Get the destination droppable id where the item is being dragged over
        if (update.destination) {
            setDraggingColumn(update.destination.droppableId);
        }
    };

    const handleDragEnd = async (result: DropResult) => {
        setDraggingColumn(null);

        if (!result.destination) return;

        const { source, destination } = result;
        const taskId = result.draggableId;

        console.log('Source:', source, 'Destination:', destination);

        if (source.index === destination.index && source.droppableId === destination.droppableId) {
            return;
        }

        const updatedTasks = [...tasks];
        const taskIndex = updatedTasks.findIndex((task) => task.taskId.toString() === taskId);

        if (taskIndex === -1) {
            console.error("Task not found!");
            return;
        }

        const movedTask = updatedTasks[taskIndex];
        movedTask.statusId = Number(destination.droppableId);

        try {
            await updateTaskStatus(movedTask.taskId, movedTask.statusId);
            console.log('Task status updated successfully');
            const newTask = await getTasks(selectedSprint?.sprintId, selectedPerson?.userId);
            setTasks(newTask);
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.filterSelectContainer}>
                    {selectedSprint ? <DropdownSelect
                        options={sprintOptions}
                        value={selectedSprint?.sprintId.toString()}
                        onChange={handleSelectSprintChange}
                    /> : <button className={styles.btn} onClick={handleNewSprint}>+ New Sprint</button>}

                    <DropdownSelect
                        placeholder={selectedPerson.userId === 0 ? "Person: All" : `Person: ${selectedPerson.fullName}`}
                        options={personOptions}
                        value={selectedPerson.userId === 0 ? "all" : selectedPerson.userId.toString()}
                        onChange={handleSelectPersonChange}
                    />
                </div>
                {selectedSprint &&
                    <div className={styles.manDay}>
                        {formatDate(selectedSprint?.start_date.toString())} - {formatDate(selectedSprint?.end_date.toString())}
                        <div>{getDaysCount(selectedSprint?.start_date.toString(), selectedSprint?.end_date.toString())} work days</div>
                    </div>
                }
            </div>

            <DragDropContext onDragUpdate={handleDragUpdate} onDragEnd={handleDragEnd}>
                <div className={styles.taskTableContainer}>
                    {status.map((statusItem) => (
                        <DragDropTaskColumn
                            key={statusItem.statusId}
                            statusItem={statusItem}
                            tasks={tasks}
                            draggingColumn={draggingColumn}
                            onDragUpdate={handleDragUpdate}
                            onDragEnd={handleDragEnd}
                        />
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default SprintBoard;
