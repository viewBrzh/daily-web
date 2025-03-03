import React from "react";
import styles from "@/styles/layout/PageContainer.module.css";
import ReturnButton from "../common/button/returnButton";

interface LayoutProps {
  title: string;
  children: React.ReactNode;
  isMain: boolean;
  mainRef?: string;
}

const PageContainer: React.FC<LayoutProps> = ({ title, children, isMain, mainRef }) => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>{!isMain && <ReturnButton href={mainRef || ""} isShowBack={false} />} {title}</h1>
        <div className={styles.head}></div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default PageContainer;
