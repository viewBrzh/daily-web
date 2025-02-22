import { FC, useEffect, useRef, useState } from "react";
import { SelectModalProps } from "../types"; // import the interface
import styles from "@/styles/modal/backdrop.module.css"; // import the CSS module
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SelectModal: FC<SelectModalProps> = ({ show, position, onClose, onUpdate, onDelete }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false); 

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setIsListening(true); 
      }, 250);

      return () => clearTimeout(timer);
    } else {
      setIsListening(false);
    }
  }, [show]);

  useEffect(() => {
    if (isListening) {
      const handleClickOutside = (e: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
          onClose();
        }
      };

      document.addEventListener("click", handleClickOutside);

      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isListening, onClose]);

  const handleUpdate = () => {
    onUpdate(); 
    onClose();   
  };
  
  const handleDelete = () => {
    onDelete();
    onClose();
  };

  if (!show) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div
        ref={modalRef}
        className={styles.modal}
        style={{
          top: position.y,
          left: position.x,
        }}
      >
        <ul className={styles.optionsList}>
          <li className={styles.optionItem} onClick={handleUpdate}>
            <FontAwesomeIcon icon={faPenToSquare} /> Update
          </li>
          <li className={styles.optionItem} onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrashCan} /> Delete
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SelectModal;
