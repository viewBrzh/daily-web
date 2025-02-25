import React, { useState } from "react";
import styles from "@/styles/modal/modal.module.css";
import { CalendarItem } from "../../types";

interface AddCalendarModalProps {
    date: string;
    isOpen: boolean;
    onClose: () => void;
    onAdd: (newEvent: CalendarItem) => void;
    projectId: number;
    createdBy: number;
}

const AddCalendarModal: React.FC<AddCalendarModalProps> = ({ date, isOpen, onClose, onAdd, projectId, createdBy }) => {
    const [formData, setFormData] = useState<CalendarItem>({
        title: "",
        description: "",
        location: "",
        date: date,
        projectId: projectId,
        created_by: createdBy,
        id: 0, // Or use a generated ID
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAdd = () => {
        onAdd({ ...formData, projectId, created_by: createdBy });
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Add Calendar Event</h2>

                <label>Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} />

                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange}></textarea>

                <label>Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} />

                <div className={styles.buttonGroup}>
                    <button onClick={onClose} type="button" className="cancel" >Cancel</button>
                    <button onClick={handleAdd} className='btn'>Add</button>
                </div>
            </div>
        </div>
    );
};

export default AddCalendarModal;
