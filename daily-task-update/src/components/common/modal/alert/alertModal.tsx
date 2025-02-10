import React from "react";
import styles from "@/styles/modal/AlertModal.module.css";

interface AlertModalProps {
  isShow: boolean;
  title: string;
  description: string;
  type: string;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ isShow, title, description, type , onClose}) => {
  if (!isShow) return null;


  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={`${styles.title} ${type === "success" ? styles.success : styles.error}`}>
          {title}
        </div>
        <p className={styles.description}>{description}</p>
        <button onClick={onClose} className='btn'>Confirm</button>
      </div>
    </div>
  );
};

export default AlertModal;
