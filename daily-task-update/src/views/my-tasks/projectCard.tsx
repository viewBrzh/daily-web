import React from "react";
import { useRouter } from "next/router";
import styles from "../../styles/mytask.module.css";

interface Project {
  projectId: string;
  title: string;
  status: "Active" | "Inactive";
  member: string;
  responsibleRole: string;
  lastUpdate: string;
  pm: string;
}

const ProjectCard: React.FC = () => {
  const projects: Project[] = [
    { projectId: "1", title: "KBank ED-412", status: "Active", member: "12", responsibleRole: "Front-end Dev", lastUpdate: "12/10/2545", pm: "Watayut Pankong (view)" },
    { projectId: "2", title: "Dimos-514", status: "Active", member: "12", responsibleRole: "Front-end Dev", lastUpdate: "12/10/2545", pm: "Watayut Pankong (view)" },
    { projectId: "3", title: "SMP-41P", status: "Active", member: "12", responsibleRole: "Front-end Dev", lastUpdate: "12/10/2545", pm: "Watayut Pankong (view)" },
    { projectId: "4", title: "Title", status: "Inactive", member: "12", responsibleRole: "Front-end Dev", lastUpdate: "12/10/2545", pm: "Watayut Pankong (view)" },
    { projectId: "5", title: "Title", status: "Inactive", member: "12", responsibleRole: "Front-end Dev", lastUpdate: "12/10/2545", pm: "Watayut Pankong (view)" },
    { projectId: "6", title: "Title", status: "Inactive", member: "12", responsibleRole: "Front-end Dev", lastUpdate: "12/10/2545", pm: "Watayut Pankong (view)" },
  ];
  const router = useRouter();

  const handleViewProject = (projectId: string) => {
    router.push("/view-project/" + { projectId });
  }

  return (
    <div className={styles.projects}>
      {projects.map((project, index) => (
        <div
          key={index}
          className={styles.projectCard}
          onClick={() => handleViewProject(project.projectId)}
        >
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
          <p>Team member: {project.member}</p>
          <p>Last Update: {project.lastUpdate}</p>
          <p>Responsible Role: {project.responsibleRole}</p>
        </div>
      ))}
    </div>
  );
};

export default ProjectCard;
