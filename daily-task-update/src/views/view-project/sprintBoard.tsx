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
import LoadingModal from "@/components/common/loadingModa";

interface CalendarProps {
    projectId: string;
}

const initStatus: Status = {
    status_id: 0,
    name: ""
}

const initialSprintData: SprintData = {
    sprint_id: 0,
    sprint_name: "",
    start_date: new Date(),
    end_date: new Date(),
    project_id: "0",
};

const initUserData: User = {
    user_id: 0,
    email: "",
    full_name: "",
    emp_id: "",
}

const SprintBoard: React.FC<CalendarProps> = ({ projectId }) => {

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
    const [isLoading, setIsLoading] = useState(false);

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

    const handleSubmitSprint = async (data: Record<string, string>) => {
        setIsLoading(true);
        setIsModalOpen(false);
        const formattedData: SprintDataInsert = {
            sprint_name: data.sprintName,
            start_date: new Date(data.start_date),
            end_date: new Date(data.end_date),
            project_id: projectId,
        };
        try {
            const res = await addNewSprint(formattedData);
            if (res) {
                fetchSprint();
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }

    };
    useEffect(()=> {
        console.log("isLoading:" + isLoading)
    }, [isLoading])

    const handleUpdateSprintSubmit = async (data: Record<string, string>) => {
        const formattedData: SprintData = {
            sprint_id: selectedSprint?.sprint_id,
            sprint_name: data.sprint_name,
            start_date: new Date(data.start_date),
            end_date: new Date(data.end_date),
            project_id: projectId,
        };
        const res = await updateSprint(formattedData);
        if (res) {
            fetchSprint();
        }
        setIsModalUpdateOpen(false);
    };

    const handleSubmitTask = async (data: Task) => {
        setIsUpdateTaskModalOpen(false);
        setIsLoading(true);
        try {
            await updateTask(data);
            const tasks = await getTasks(selectedSprint?.sprint_id, selectedPerson?.user_id);
            setTasks(tasks);
            console.log(task)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitAddTask = async (data: Task) => {
        setIsInsertTaskOpen(false);
        setIsLoading(true);
        try {
            await insertTask(data);
            const tasks = getTasks(selectedSprint?.sprint_id, selectedPerson?.user_id);
            setTasks(await tasks);
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };

    const onClickSprintSelect = async () => {
        const dropdownSprint = await getSprintByProject(projectId);
        setSprintOption(dropdownSprint);
    };

    const onClickPersonSelect = async () => {
        const personOptionRes = await getPersonFilterOption(selectedSprint?.sprint_id);
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
        setIsLoading(true);
        try {
            await deleteTask(task.task_id);

            const tasks = await getTasks(selectedSprint?.sprint_id, selectedPerson?.user_id);
            setTasks(tasks);

            // Close modal after task deletion
            setIsShowAlertDelete(false);
        } catch (error) {
            console.error("Error deleting task:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchStatus = async () => {
            setIsLoading(true);
            try {
                const status = await getTaskStatus();
                setStatus(status);
            } catch (error) {
                console.error("Error fetching status:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStatus();
    }, [])

    const fetchSprint = async () => {
        setIsLoading(true);
        try {
            const currentSprint = await getCurrentSprintByProject(projectId);
            setSelectedSprint(currentSprint);

            const dropdownSprint = await getSprintByProject(projectId);
            setSprintOption(dropdownSprint);
        } catch (error) {
            console.error("Error fetching sprints:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSprint();
    }, [projectId]);

    useEffect(() => {
        if (!selectedSprint) return;
        const fetchPerson = async () => {
            try {
                const personOptionRes = await getPersonFilterOption(selectedSprint?.sprint_id);
                setPersonOption(personOptionRes);
            } catch (error) {
                console.error("Error fetching persons:", error);
            }
        };
        fetchPerson();
    }, [selectedSprint]);

    useEffect(() => {
        if (!selectedSprint) return;
        setIsLoading(true);
        const fetchTasks = async () => {
            try {
                const tasks = await getTasks(selectedSprint?.sprint_id, selectedPerson?.user_id);
                setTasks(tasks);
                console.log(task)
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setIsLoading(false);
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
            value: person?.user_id?.toString(),
            label: person.full_name,
        }))
    ];

    const specialSprintOptions = [
        { value: "newSprint", label: "+ New Sprint" }
    ];

    const sprintOptions = [
        ...sprintOption.map((sprint) => ({
            value: sprint?.sprint_id?.toString(),
            label: sprint.sprint_name,
        })),

        ...specialSprintOptions,
    ];

    const handleSelectSprintChange = (selectedValue: string) => {
        if (selectedValue === "newSprint") {
            handleNewSprint();
        } else {
            const selected = sprintOption.find((sprint) => sprint?.sprint_id?.toString() === selectedValue);
            if (selected) {
                setSelectedSprint(selected);
            }
        }
    };


    const handleSelectPersonChange = (selectedValue: string) => {
        if (selectedValue === "all") {
            setSelectedPerson(initUserData);
        } else {
            const selected = personOption?.find((person) => person?.user_id?.toString() === selectedValue);
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
        const taskIndex = updatedTasks.findIndex((task) => task.task_id?.toString() === taskId);

        if (taskIndex === -1) {
            console.error("Task not found!");
            return;
        }

        const movedTask = updatedTasks[taskIndex];
        movedTask.status_id = Number(destination.droppableId);

        try {
            await updateTaskStatus(movedTask.task_id, movedTask.status_id);
            const newTask = await getTasks(selectedSprint?.sprint_id, selectedPerson?.user_id);
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
                        onClick={onClickSprintSelect}
                        options={sprintOptions}
                        value={selectedSprint?.sprint_id?.toString()}
                        onChange={handleSelectSprintChange}
                    /> : <button className={styles.btn} onClick={handleNewSprint}>+ New Sprint</button>}

                    <DropdownSelect
                        onClick={onClickPersonSelect}
                        placeholder={selectedPerson.user_id === 0 ? "Person: All" : `Person: ${selectedPerson.full_name}`}
                        options={personOptions}
                        value={selectedPerson.user_id === 0 ? "all" : selectedPerson.user_id?.toString()}
                        onChange={handleSelectPersonChange}
                    />
                </div>
                {selectedSprint &&
                    <div className={styles.newButtonEnd}><button className={styles.btn} onClick={handleInsertTask}>+ New Task</button></div>
                }
            </div>
            {selectedSprint &&
                <div className={styles.manDay} onClick={handleUpdateSprint} style={{ cursor: "pointer" }}>
                    {formatDate(selectedSprint?.start_date?.toString())} - {formatDate(selectedSprint?.end_date?.toString())}| ({getDaysCount(selectedSprint?.start_date?.toString(), selectedSprint?.end_date?.toString())} work days)
                </div>
            }
            <DragDropContext
                onDragUpdate={handleDragUpdate}
                onDragEnd={handleDragEnd}
            >
                <div className={styles.taskTableContainer}>
                    {status.map((statusItem) => (
                        <DragDropTaskColumn
                            key={statusItem.status_id}
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
                title={"Update " + selectedSprint?.sprint_name}
                fields={[
                    { name: "sprint_name", label: "Sprint Name", required: true },
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
                sprintId={selectedSprint?.sprint_id}
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
            <LoadingModal isLoading={isLoading} />
        </div>
    );
};

export default SprintBoard;
