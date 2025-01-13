import React from "react";
import NavBar from "@/components/layout/navbar";
import styles from "../../styles/mytask.module.css";
import Layout from "@/components/layout/layout";
import ProjectCard from "@/views/my-tasks/projectCard";
import PageContainer from "@/components/layout/pageContainer";

interface Project {
  title: string;
  status: "Active" | "Inactive";
}

const MyTasks: React.FC = () => {

  return (
    <Layout>
      <PageContainer title={"My Project"}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Project List</h1>
            <p>Active project 3 of 9</p>
            <button className={styles.addProjectBtn}>Add Project</button>
          </div>
          <ProjectCard />
          <div className={styles.pagination}>
            <span>Showing 6 of 9</span>
            <span>page 1 / 2</span>
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default MyTasks;
