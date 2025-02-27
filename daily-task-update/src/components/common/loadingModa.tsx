import React from "react";
import styles from "@/styles/modal/loading.module.css";

interface loadingProp {
    isLoading: boolean;
}

const LoadingModal: React.FC<loadingProp> = ({ isLoading }) => {
    if (!isLoading) return null; // Return null instead of undefined or false.

    return (
        <div className={styles.modal}>
            <div className={styles.container}>
                <div className={styles.loader}></div>
            </div>
        </div>
    );
};

export default LoadingModal;
