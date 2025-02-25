'use client';
import { useState, useEffect } from 'react';
import styles from '@/styles/modal/updateTask.module.css';
import { Field } from '../types';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    fields: Field[];
    onSubmit: (data: Record<string, string>) => void;
    init?: Record<string, string>; // Initial values for updating sprint
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, fields, onSubmit, init }) => {
    // Don't return early here, render the modal structure if `isOpen` is true
    if (!isOpen) return null;

    const getCurrentDate = () => new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    // Initialize formData with default values or values from `init`
    const [formData, setFormData] = useState<Record<string, string>>(() => {
        return fields.reduce((acc, field) => ({
            ...acc,
            [field.name]: init?.[field.name] || (field.type === 'date' ? getCurrentDate() : '')
        }), {});
    });

    // Update formData when `init` or `fields` change
    useEffect(() => {
        setFormData(
            fields.reduce((acc, field) => ({
                ...acc,
                [field.name]: init?.[field.name] || (field.type === 'date' ? getCurrentDate() : '')
            }), {})
        );
    }, [init, fields]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modalContainer}>
                <h2 className={styles.title}>{title}</h2>
                <form onSubmit={handleSubmit}>
                    {fields.map((field) => (
                        <div key={field.name} className={styles.inputGroup}>
                            <label className={styles.label}>{field.label}</label>
                            <input
                                type={field.type || 'text'}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder={field.placeholder || ''}
                                required={field.required || false}
                            />
                        </div>
                    ))}
                    <div className={styles.buttonGroup}>
                        <button type="button" className='cancel' onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className='btn'>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
