import styles from "@/styles/view-project/sprintBoard.module.css";
import DropdownSelect from "@/components/common/drop-down/dropdownSelect";
import { initTaskData, SprintData, SprintDataInsert, sprintToRecord, Status, Task, User } from "@/components/common/types";
import { addNewSprint, deleteTask, getCurrentSprintByProject, getPersonFilterOption, getSprintByProject, getTasks, getTaskStatus, insertTask, updateSprint, updateTask, updateTaskStatus } from "@/pages/api/my-task/sprint";
import React, { useCallback, useEffect, useState } from "react";
import { DragDropContext, DropResult, OnDragUpdateResponder } from "@hello-pangea/dnd";
import DragDropTaskColumn from "@/components/common/DragDropTaskColumn";
import Modal from "@/components/common/modal/addModal";
import UpdateTaskModal from "@/components/common/modal/sprint/updateTaskModal";
import AlertModal from "@/components/common/modal/alert/alertModal";

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
    projectId: "0",
};

const initUserData: User = {
    userId: 0,
    username: "",
    fullName: "",
    empId: "",
}

const SprintBoard: React.FC<CalendarProps> = ({ isSprint, projectId }) => {

    const [selectedSprint, setSelectedSprint] = useState<SprintData>(initialSprintData);
    const [selectedPerson, setSelectedPerson] = useState<User>(initUserData);
    const [personOption, setPersonOption] = useState<User[]>([initUserData]);
    const [sprintOption, setSprintOption] = useState<SprintData[]>([initialSprintData]);
    const [tasks, setTasks] = useState<Task[]>([initTaskData]);
    const [task, setTask] = useState<Task>(initTaskData);
    const [status, setStatus] = useState<Status[]>([initStatus]);
    const [draggingColumn, setDraggingColumn] = useState<string | null>(null);
    const [isUpdateTaskModalOpen, setIsUpdateTaskModalOpen] = useState(false);
    const [isInsertTaskOpen, setIsInsertTaskOpen] = useState(false);
    const [isShowAlertDelete, setIsShowAlertDelete] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);

    const handleNewSprint = async () => {
        setIsModalOpen(true);
    };

    const handleUpdateSprint = async () => {
        setIsModalUpdateOpen(true);
    };

    const handleInsertTask = () => {
        setIsInsertTaskOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsUpdateTaskModalOpen(false);
        setIsInsertTaskOpen(false);
        setIsModalUpdateOpen(false);
    };

    const handleSubmitSprint = (data: Record<string, string>) => {
        const formattedData: SprintDataInsert = {
            sprintName: data.sprintName,
            start_date: new Date(data.start_date),
            end_date: new Date(data.end_date),
            projectId: projectId,
        };
        addNewSprint(formattedData);
        setIsModalOpen(false);
    };

    const handleUpdateSprintSubmit = (data: Record<string, string>) => {
        const formattedData: SprintData = {
            sprintId: selectedSprint?.sprintId,
            sprintName: data.sprintName,
            start_date: new Date(data.start_date),
            end_date: new Date(data.end_date),
            projectId: projectId,
        };
        updateSprint(formattedData);
        setIsModalUpdateOpen(false);
    };

    const handleSubmitTask = async (data: Task) => {
        try {
            await updateTask(data);
            const tasks = getTasks(selectedSprint?.sprintId, selectedPerson?.userId);
            setTasks(await tasks);
        } catch (error) {
            console.log(error)
        }
        setIsUpdateTaskModalOpen(false);
    };

    const handleSubmitAddTask = async (data: Task) => {
        try {
            await insertTask(data);
            const tasks = getTasks(selectedSprint?.sprintId, selectedPerson?.userId);
            setTasks(await tasks);
        } catch (error) {
            console.log(error)
        }
        setIsInsertTaskOpen(false);
    };

    const onClickSprintSelect = async () => {
        const dropdownSprint = await getSprintByProject(projectId);
        setSprintOption(dropdownSprint);
    };

    const onClickPersonSelect = async () => {
        const personOptionRes = await getPersonFilterOption(selectedSprint?.sprintId);
        setPersonOption(personOptionRes);
    };

    const handleEditTask = useCallback((task: Task) => {
        setTask(task);
        setIsUpdateTaskModalOpen(true);
    }, []);

    const handleDeleteTaskAlert = (taskToDelete: Task) => {
        setTask(taskToDelete);
        setIsShowAlertDelete(true);
    };

    // Confirm handler
    const handleDeleteTask = async () => {
        console.log("Confirm to Deleting:", task);
        try {
            await deleteTask(task.taskId);

            const tasks = await getTasks(selectedSprint?.sprintId, selectedPerson?.userId);
            setTasks(tasks);

            // Close modal after task deletion
            setIsShowAlertDelete(false);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

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
            value: sprint?.sprintId?.toString(),
            label: sprint.sprintName,
        })),

        ...specialSprintOptions,
    ];

    const handleSelectSprintChange = (selectedValue: string) => {
        if (selectedValue === "newSprint") {
            handleNewSprint();
        } else {
            const selected = sprintOption.find((sprint) => sprint?.sprintId?.toString() === selectedValue);
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
            timeZone: 'UTC'
        }).format(parsedDate);
    };

    const getDaysCount = (startDate: string, endDate: string): number => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDifference = end.getTime() - start.getTime();
        const daysDifference = timeDifference / (1000 * 3600 * 24);

        return daysDifference;
    };

    const handleDragUpdate: OnDragUpdateResponder<string> = (update) => {
        const { destination } = update;
    
        // If destination exists and reason is drag
        if (destination) {
            setDraggingColumn(destination.droppableId);
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
            const newTask = await getTasks(selectedSprint?.sprintId, selectedPerson?.userId);
            setTasks(newTask);
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    if (isSprint !== "Sprint") return null;

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.filterSelectContainer}>
                    {selectedSprint ? <DropdownSelect
                        onClick={onClickSprintSelect}
                        options={sprintOptions}
                        value={selectedSprint?.sprintId?.toString()}
                        onChange={handleSelectSprintChange}
                    /> : <button className={styles.btn} onClick={handleNewSprint}>+ New Sprint</button>}

                    <DropdownSelect
                        onClick={onClickPersonSelect}
                        placeholder={selectedPerson.userId === 0 ? "Person: All" : `Person: ${selectedPerson.fullName}`}
                        options={personOptions}
                        value={selectedPerson.userId === 0 ? "all" : selectedPerson.userId.toString()}
                        onChange={handleSelectPersonChange}
                    />
                </div>
                {selectedSprint &&
                    <div className={styles.newButtonEnd}><button className={styles.btn} onClick={handleInsertTask}>+ New Task</button></div>
                }
            </div>
            {selectedSprint &&
                <div className={styles.manDay} onClick={handleUpdateSprint} style={{ cursor: "pointer" }}>
                    {formatDate(selectedSprint?.start_date.toString())} - {formatDate(selectedSprint?.end_date.toString())}| ({getDaysCount(selectedSprint?.start_date.toString(), selectedSprint?.end_date.toString())} work days)
                </div>
            }
            <DragDropContext
                onDragUpdate={handleDragUpdate}
                onDragEnd={handleDragEnd}
            >
                <div className={styles.taskTableContainer}>
                    {status.map((statusItem) => (
                        <DragDropTaskColumn
                            key={statusItem.statusId}
                            statusItem={statusItem}
                            tasks={tasks}
                            draggingColumn={draggingColumn}
                            onDragEnd={handleDragEnd}
                            onEdit={handleEditTask}
                            onDelete={handleDeleteTaskAlert}
                        />
                    ))}
                </div>
            </DragDropContext>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Create New Sprint"
                fields={[
                    { name: "sprintName", label: "Sprint Name", required: true },
                    { name: "start_date", label: "Start Date", type: "date", required: true },
                    { name: "end_date", label: "End Date", type: "date", required: true }
                ]}
                onSubmit={handleSubmitSprint}
            />
            <Modal
                isOpen={isModalUpdateOpen}
                onClose={handleCloseModal}
                title={"Update " + selectedSprint?.sprintName}
                fields={[
                    { name: "sprintName", label: "Sprint Name", required: true },
                    { name: "start_date", label: "Start Date", type: "date", required: true },
                    { name: "end_date", label: "End Date", type: "date", required: true }
                ]}
                onSubmit={handleUpdateSprintSubmit}
                init={sprintToRecord(selectedSprint)}
            />
            <UpdateTaskModal
                isOpen={isUpdateTaskModalOpen}
                onClose={handleCloseModal}
                title={task.name}
                onSubmit={handleSubmitTask}
                task={task}
                status={status}
            />
            <UpdateTaskModal
                isOpen={isInsertTaskOpen}
                onClose={handleCloseModal}
                title={initTaskData.name}
                onSubmit={handleSubmitAddTask}
                task={initTaskData}
                status={status}
                projectId={parseInt(projectId)}
                sprintId={selectedSprint?.sprintId}
            />
            <AlertModal
                isShow={isShowAlertDelete}
                title="Delete Task"
                type="error"
                description="This action is irreversible. Once deleted, the task cannot be recovered. Do you wish to proceed?"
                onClose={() => setIsShowAlertDelete(false)}
                onConfirm={handleDeleteTask}
                isCancelable={true}
            />
        </div>
    );
};

export default SprintBoard;
