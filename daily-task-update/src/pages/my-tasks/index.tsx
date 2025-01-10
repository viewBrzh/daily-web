import React from "react"; 
import NavBar from "@/components/navbar";
import styles from "../../styles/mytask.module.css";
import Layout from "@/components/layout";

interface Project {
  title: string;
  status: "Active" | "Inactive";
}

const MyTasks: React.FC = () => {
  const projects: Project[] = [
    { title: "KBank ED-412", status: "Active" },
    { title: "Dimos-514", status: "Active" },
    { title: "SMP-41P", status: "Active" },
    { title: "Title", status: "Inactive" },
    { title: "Title", status: "Inactive" },
    { title: "Title", status: "Inactive" },
  ];

  return (
    <Layout>
      <NavBar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Project List</h1>
          <p>Active project 3 of 9</p>
          <button className={styles.addProjectBtn}>Add Project</button>
        </div>
        <div className={styles.projects}>
          {projects.map((project, index) => (
            <div key={index} className={styles.projectCard}>
              <h2>{project.title}</h2>
              <span
                className={
                  project.status === "Active"
                    ? styles.activeStatus
                    : styles.inactiveStatus
                }
              >
                {project.status}
              </span>
              <p>Team member: 12</p>
              <p>Last Update: 16/12/2024</p>
              <p>Responsible Role: Front-End Dev</p>
              <p>Project Manager: Watayut Pankong</p>
              <a href="#">(view)</a>
            </div>
          ))}
        </div>
        <div className={styles.pagination}>
          <span>Showing 6 of 9</span>
          <span>page 1 / 2</span>
        </div>
      </div>
    </Layout>
  );
};

export default MyTasks;
