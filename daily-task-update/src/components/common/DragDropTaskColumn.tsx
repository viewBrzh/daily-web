import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Task, Status } from "./types";
import SmallUserProfileIcon from "./smallUserProfileIcon";
import styles from "@/styles/view-project/sprintBoard.module.css";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface DragDropTaskColumnProps {
    statusItem: Status;
    tasks: Task[];
    draggingColumn: string | null;
    onDragUpdate: (update: any) => void;
    onDragEnd: (result: any) => void;
    onEdit: (task: Task) => void;
}

const DragDropTaskColumn: React.FC<DragDropTaskColumnProps> = ({
    statusItem,
    tasks,
    draggingColumn,
    onDragUpdate,
    onDragEnd,
    onEdit,
}) => {
    return (
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
                                    >
                                        <div className={styles.head}>
                                            <div className={styles.name}>
                                                <strong>{task.taskId}</strong> {task.name}
                                            </div>
                                            <button className={styles.edit} onClick={() => onEdit(task)}><FontAwesomeIcon icon={faPenToSquare} /></button>
                                        </div>

                                        <div className={`taskStatus taskStatus-${statusItem.name}`}>
                                            {statusItem.name}
                                        </div>
                                        <div className={styles.resUser}>
                                            <SmallUserProfileIcon fullName={task.resUserFullName} />
                                            <span style={{ margin: 'auto 0' }} >{task.resUserFullName}</span>
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
    );
};

export default DragDropTaskColumn;