import React from "react";
import styles from "../../styles/PageContainer.module.css"

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

const PageContainer: React.FC<LayoutProps> = ({ title, children }) => {
  return (
    <div className={"pageContainer"}>
      {/* Page Title */}
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>{title}</h1>
      
      {/* Content */}
      <div>{children}</div>
    </div>
  );
};

export default PageContainer;
