import { Droppable, Draggable } from "@hello-pangea/dnd";
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
    onDragUpdate: (update: any) => void;
    onDragEnd: (result: any) => void;
    onEdit: (Task: Task) => void;
    onDelete: (Task: Task) => void; // Pass taskId for deletion
}

const DragDropTaskColumn: React.FC<DragDropTaskColumnProps> = ({
    statusItem,
    tasks,
    draggingColumn,
    onDragUpdate,
    onDragEnd,
    onEdit,
    onDelete,
}) => {
    const [isShowModal, setIsShowModal] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [clickedTask, setClickedTask] = useState<Task>(initTaskData);

    const handleTaskClick = (e: React.MouseEvent, task: Task) => {
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
            <Droppable key={statusItem.statusId} droppableId={statusItem.statusId.toString()}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`${styles.statusColumn} ${draggingColumn === statusItem.statusId.toString() ? styles.draggingOver : ""
                            }`}
                    >
                        <div className={styles.header}>{statusItem.name}</div>
                        {tasks
                            .filter((task) => task.statusId === statusItem.statusId)
                            .map((task, index) => (
                                <Draggable key={task.taskId} draggableId={task.taskId.toString()} index={index}>
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
                                                    <strong>{task.taskId}</strong> {task.name}
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
                                                {task.resUserFullName && <SmallUserProfileIcon fullName={task.resUserFullName} />}
                                                <span style={{ margin: "auto 0" }}>{task.resUserFullName}</span>
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
