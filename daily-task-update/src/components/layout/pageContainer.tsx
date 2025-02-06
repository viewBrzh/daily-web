import React from "react";
import styles from "@/styles/layout/PageContainer.module.css";

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

const PageContainer: React.FC<LayoutProps> = ({ title, children }) => {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>{title}</h1>
      <div>{children}</div>
    </div>
  );
};

export default PageContainer;
