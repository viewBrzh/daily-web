import { Droppable, Draggable } from "@hello-pangea/dnd";
import { DropResult } from "@hello-pangea/dnd"; // Assuming DropResult is exported from the library
import { Task, Status, initTaskData } from "./types";
import SmallUserProfileIcon from "./smallUserProfileIcon";
import styles from "@/styles/view-project/sprintBoard.module.css";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import SelectModal from "./modal/selectModal";

interface DragDropTaskColumnProps {
    statusItem: Status;
    tasks: Task[];
    draggingColumn: string | null;
    onDragEnd: (result: DropResult) => void; // Use DropResult instead of any
    onEdit: (Task: Task) => void;
    onDelete: (Task: Task) => void; // Pass taskId for deletion
}

const DragDropTaskColumn: React.FC<DragDropTaskColumnProps> = ({
    statusItem,
    tasks,
    draggingColumn,
    onEdit,
    onDelete,
}) => {
    const [isShowModal, setIsShowModal] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [clickedTask, setClickedTask] = useState<Task>(initTaskData);

    const handleTaskClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, task: Task) => {
        if (!isShowModal) {
            setPosition({
                x: e.clientX,
                y: e.clientY,
            });
            setClickedTask(task); // Save the clicked task
            setIsShowModal(true);
        }
    };

    return (
        <>
            <Droppable key={statusItem.status_id} droppableId={statusItem.status_id?.toString()}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`${styles.statusColumn} ${draggingColumn === statusItem.status_id?.toString() ? styles.draggingOver : ""
                            }`}
                    >
                        <div className={styles.header}>{statusItem.name}</div>
                        {tasks
                            .filter((task) => task.status_id === statusItem.status_id)
                            .map((task, index) => (
                                <Draggable key={task.task_id} draggableId={task.task_id?.toString()} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={styles.task}
                                            onClick={(e) => handleTaskClick(e, task)} // Pass the event and task
                                        >
                                            <div className={styles.head}>
                                                <div className={styles.name}>
                                                    <strong>{task.task_id}</strong> {task.name}
                                                </div>
                                                <button
                                                    className={styles.edit}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEdit(task);
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faPenToSquare} />
                                                </button>
                                            </div>

                                            <div className={`taskStatus taskStatus-${statusItem.name}`}>
                                                {statusItem.name}
                                            </div>
                                            <div className={styles.resUser}>
                                                {task.res_user_full_name && <SmallUserProfileIcon fullName={task.res_user_full_name} />}
                                                <span style={{ margin: "auto 0" }}>{task.res_user_full_name}</span>
                                            </div>
                                            <div className={styles.priority}>{task.priority}</div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

            <SelectModal
                show={isShowModal}
                position={position}
                onClose={() => setIsShowModal(false)}
                onDelete={() => {
                    onDelete(clickedTask); // Pass the clickedTask's taskId to the delete function
                    setIsShowModal(false); // Close the modal after deletion
                }}
                onUpdate={() => onEdit(clickedTask)} // Use clickedTask to handle the update
            />
        </>
    );
};

export default DragDropTaskColumn;
