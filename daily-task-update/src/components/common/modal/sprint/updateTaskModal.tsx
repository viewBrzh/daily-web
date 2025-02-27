import { useEffect, useState } from 'react';
import styles from '@/styles/modal/updateTask.module.css';
import { Status, Task } from '../../types';
import ProjectMemberDropdown from '../../drop-down/projectMemberDropdown';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onSubmit: (data: Task) => void;
    task: Task;
    status: Status[];
    projectId?: number;
    sprintId?: number;
}

const UpdateTaskModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    task,
    status,
    projectId,
    sprintId
}) => {
    if (!isOpen) return null;

    // Ensure formData updates when task changes
    const [formData, setFormData] = useState<Task>(task);

    useEffect(() => {
        setFormData(task);
    }, [task]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData((prevState) => ({
            ...prevState,
            description: e.target.value
        }));
    };

    const handleSelectUser = (userId: number, userName: string) => {
        setFormData((prevState) => ({
            ...prevState,
            resUserId: userId,
            assignedUserName: userName
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            project_id: projectId ?? formData.project_id,
            sprint_id: sprintId ?? formData.sprint_id
        });
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modalContainerTask}>
                <div className={styles.name}>
                    <strong>{task.task_id !== 0 ? task.task_id : '#'}</strong>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={styles.nameInput}
                    />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formContainer}>
                        <div className={styles.leftColumn}>
                            <label className={styles.label}>Description</label>
                            <textarea
                                placeholder="Enter task description"
                                value={formData.description}
                                onChange={handleTextAreaChange}
                                className={styles.input}
                                rows={15}
                            />
                        </div>

                        <div className={styles.rightColumn}>
                            <label className={styles.label}>Assigned To</label>
                            <ProjectMemberDropdown
                                projectId={projectId || task.project_id}
                                onSelectUser={handleSelectUser}
                                userId={task.res_user_id}
                            />

                            <label className={styles.label}>Status</label>
                            <select
                                name="statusId"
                                className={styles.select}
                                value={formData.status_id}
                                onChange={handleChange}
                            >
                                {status.map((st) => (
                                    <option key={st.status_id} value={st.status_id}>
                                        {st.status_id} - {st.name}
                                    </option>
                                ))}
                            </select>

                            <label className={styles.label}>Priority</label>
                            <select
                                name="priority"
                                className={styles.select}
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option key={1} value={1}>
                                    1 - Highest
                                </option>
                                <option key={2} value={2}>
                                    2 - High
                                </option>
                                <option key={3} value={3}>
                                    3 - Medium
                                </option>
                                <option key={4} value={4}>
                                    4 - Low
                                </option>
                            </select>
                        </div>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="button" className="cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateTaskModal;
