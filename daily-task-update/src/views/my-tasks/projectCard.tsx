import React from "react"; 
import styles from "../../styles/mytask.module.css";

interface Project {
  title: string;
  status: "Active" | "Inactive";
  member: string;
  responsibleRole: string;
  lastUpdate: string;
  pm: string;
}

const ProjectCard: React.FC = () => {
  const projects: Project[] = [
    { title: "KBank ED-412", status: "Active", member: "12", responsibleRole: "Front-end Dev", lastUpdate: "12/10/2545", pm: "Watayut Pankong (view)" },
    { title: "Dimos-514", status: "Active", member: "12", responsibleRole: "Front-end Dev", lastUpdate: "12/10/2545", pm: "Watayut Pankong (view)"  },
    { title: "SMP-41P", status: "Active", member: "12", responsibleRole: "Front-end Dev", lastUpdate: "12/10/2545", pm: "Watayut Pankong (view)"  },
    { title: "Title", status: "Inactive", member: "12", responsibleRole: "Front-end Dev", lastUpdate: "12/10/2545", pm: "Watayut Pankong (view)"  },
    { title: "Title", status: "Inactive", member: "12", responsibleRole: "Front-end Dev", lastUpdate: "12/10/2545", pm: "Watayut Pankong (view)"  },
    { title: "Title", status: "Inactive", member: "12", responsibleRole: "Front-end Dev", lastUpdate: "12/10/2545", pm: "Watayut Pankong (view)"  },
  ];

  return (
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
              <p>Team member: {project.member}</p>
              <p>Last Update: {project.lastUpdate}</p>
              <p>Responsible Role: {project.responsibleRole}</p>
            </div>
          ))}
        </div>
  );
};

export default ProjectCard;
