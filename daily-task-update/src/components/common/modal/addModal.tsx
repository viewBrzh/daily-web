'use client';
import { useState } from 'react';
import styles from '@/styles/modal/modal.module.css';
import { Field } from '../types';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    fields: Field[];
    onSubmit: (data: Record<string, string>) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, fields, onSubmit }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState<Record<string, string>>(
        fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
    );

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
                        <button
                            type="button"
                            className='cancel'
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className='btn'
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
