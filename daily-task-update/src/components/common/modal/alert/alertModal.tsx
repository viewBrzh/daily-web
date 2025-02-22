import React from "react";
import styles from "@/styles/modal/AlertModal.module.css";

interface AlertModalProps {
  isShow: boolean;
  title: string;
  description: string;
  type: string;
  onClose: () => void;
  onConfirm: () => void;
  isCancelable: boolean;
}

const AlertModal: React.FC<AlertModalProps> = ({ isShow, title, description, type, onClose, isCancelable, onConfirm }) => {
  if (!isShow) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={`${styles.title} ${type === "success" ? styles.success : styles.error}`}>
          {title}
        </div>
        <p className={styles.description}>{description}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
          {isCancelable && <button onClick={onClose} className='cancel'>Cancel</button>}
          <button onClick={onConfirm} className='btn'>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
