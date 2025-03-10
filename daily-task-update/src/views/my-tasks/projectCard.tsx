import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/my-project/mytask.module.css";
import { Project } from "@/components/common/types";
import StatusBadge from "@/components/common/statusBadge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faCalendarDays, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";

interface ProjectCardProps {
  pageData: Project[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({ pageData }) => {

  const router = useRouter();
  const [projects, setProjects] = useState(pageData);

  const handleViewProject = (projectId: string) => {
    router.push(`/my-tasks/view-project/${projectId}`);
  };

  useEffect(() => {
    setProjects(pageData);
  });

  return (
    <div>
      {projects?.length > 0 ? (<div className={styles.projects}>
        {projects.map((project, index) => (
          <div
            key={index}
            className={styles.projectCard}
            onClick={() => handleViewProject(project.project_id.toString())}
          >
            <div className={styles.projectCardHeader}>
              <div className={styles.titleContainer}>
                <h2 className={styles.title}>{project.name}</h2>
              </div>
              <StatusBadge status={project.status} />
            </div>
            <p className={styles.projectCode}>{project.project_code}</p>
            <div className={styles.statsContainer}>
              <div className={styles.statItem}>
                <p className={styles.statLabel}><FontAwesomeIcon icon={faClipboard} /> Task</p>
                <p className={styles.statValue}>{project.task}</p>
              </div>
              <div className={styles.statItem}>
                <p className={styles.statLabel}><FontAwesomeIcon icon={faCalendarDays} /> Last Update</p>
                <p className={styles.statValue}>{project.updated}</p>
              </div>
              <div className={styles.statItem}>
                <p className={styles.statLabel}><FontAwesomeIcon icon={faPeopleGroup} /> Member</p>
                <p className={styles.statValue}>{project.members}</p>
              </div>
            </div>
          </div>
        ))}
      </div>) : (<div className="data-not-found">
        Project not found.
      </div>)}
    </div>
  );
};

export default ProjectCard;
