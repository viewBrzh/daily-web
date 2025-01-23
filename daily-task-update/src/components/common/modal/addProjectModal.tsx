import React, { useState } from 'react';
import styles from '@/styles/modal.module.css'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: {
    title: string;
    fields: Array<{ label: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }>;
    onSubmit: () => void;
  };
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, payload }) => {
  if (!isOpen) return null;

  const [currentPage, setCurrentPage] = useState(1);

  const handleNext = () => {
    setCurrentPage(2);
  }

  const handleBack = () => {
    setCurrentPage(2);
  }

  return (
    <div className={styles.modalOverlay}>
      {currentPage === 1 &&
        <div className={styles.modal}>
          <h2>{payload.title}</h2>
          <form onSubmit={(e) => { e.preventDefault(); payload.onSubmit(); }}>
            {payload.fields.map((field, index) => (
              <div key={index} className={styles.formGroup}>
                <label htmlFor={field.label}>{field.label}</label>
                <input
                  id={field.label}
                  type="text"
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={field.onChange}
                  required
                />
              </div>
            ))}
            <div className={styles.formActions}>
              <button type="button" className="cancel" onClick={onClose}>Cancel</button>
              <button className="btn" type="submit" onClick={handleNext}>Next</button>
            </div>
          </form>
        </div>}
      {currentPage === 2 &&
        <div className={styles.modal}>
          <h2>{payload.title}</h2>
          <form onSubmit={(e) => { e.preventDefault(); payload.onSubmit(); }}>
            {payload.fields.map((field, index) => (
              <div key={index} className={styles.formGroup}>
                <label htmlFor={field.label}>{field.label}</label>
                <input
                  id={field.label}
                  type="text"
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={field.onChange}
                  required
                />
              </div>
            ))}
            <div className={styles.formActions}>
              <button type="button" className="cancel" onClick={handleBack}>Back</button>
              <button className="btn" type="submit">Submit</button>
            </div>
          </form>
        </div>}
    </div>
  );
};

export default Modal;
