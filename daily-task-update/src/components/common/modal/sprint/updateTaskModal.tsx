import { useState } from 'react';
import styles from '@/styles/modal/updateTask.module.css';
import { Task } from '../../types';
import ProjectMemberDropdown from '../../drop-down/projectMemberDropdown';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onSubmit: (data: Task) => void;
    task: Task;
}

const UpdateTaskModal: React.FC<ModalProps> = ({ isOpen, onClose, title, onSubmit, task }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState<Task>(task);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            description: value
        }));
    };

    const handleSelectUser = (userId: number, userName: string) => {
        setFormData((prevState) => ({
            ...prevState,
            assignedUserId: userId,  // Assuming 'assignedUserId' is the correct field in Task type
            assignedUserName: userName // Optional: Store name if needed for display
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modalContainerTask}>
                <div className={styles.name}>
                    <strong>{task.taskId}</strong>
                    <input
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        style={{ width: '90%', padding: '8px' }}
                    />
                </div>
                <form onSubmit={handleSubmit} className={styles.formContainer}>
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
                            projectId={task.projectId}
                            onSelectUser={handleSelectUser}
                            userId={task.resUserId}
                        />

                        <label className={styles.label}>Status</label>
                        <input
                            type="number"
                            name="statusId"
                            value={formData.statusId}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />

                        <label className={styles.label}>Priority</label>
                        <input
                            type="text"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                </form>
                <div className={styles.buttonGroup}>
                    <button
                        type="button"
                        className="cancel"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UpdateTaskModal;
