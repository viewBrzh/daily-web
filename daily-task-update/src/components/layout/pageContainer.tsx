import React from "react";
import styles from "@/styles/layout/PageContainer.module.css";

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

const PageContainer: React.FC<LayoutProps> = ({ title, children }) => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <div className={styles.head}></div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default PageContainer;
