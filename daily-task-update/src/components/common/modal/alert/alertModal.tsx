import styles from "@/styles/modal/AlertModal.module.css";

interface AlertModalProps {
  isShow: boolean;
  title: string;
  description: string;
  type: "success" | "warning" | "error";
  onClose: () => void;
  onConfirm?: () => void;
  isCancelable?: boolean;
}

const AlertModal: React.FC<AlertModalProps> = ({ isShow, title, description, type, onClose, onConfirm, isCancelable = false }) => {
  if (!isShow) return null;

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${styles[type]}`}>
        <h2 className={styles.title}>{title}</h2>
        <p>{description}</p>
        <div className={styles.buttons}>
          {isCancelable && <button className='cancel' onClick={onClose}>Cancel</button>}
          {onConfirm && <button className='btn' onClick={onConfirm}>Confirm</button>}
          {!onConfirm && <button className='btn' onClick={onClose}>OK</button>}
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
