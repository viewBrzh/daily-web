import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/mytask.module.css";
import { Project } from "./types";
import StatusBadge from "./statusBadge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faCalendarDays, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";

interface ProjectCardProps {
  pageData: Project[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({ pageData }) => {

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const router = useRouter();
  const [projects, setProjects] = useState(pageData);
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const handleViewProject = (projectId: string) => {
    router.push(`/my-tasks/view-project/${projectId}`);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentProjects = projects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setProjects(pageData);
  });

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, projects.length);

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      {currentProjects?.length > 0 ? (<div className={styles.projects}>
        {currentProjects.map((project, index) => (
          <div
            key={index}
            className={styles.projectCard}
            onClick={() => handleViewProject(project.projectId.toString())}
          >
            <div className={styles.projectCardHeader}>
              <div>
                <h2>{project.name}</h2>
                <p className={styles.projectCode}>{project.projectCode}</p>
              </div>
              <StatusBadge status={project.status} />
            </div>
            <div className={styles.statsContainer}>
              <div className={styles.statItem}>
                <p className={styles.statLabel}><FontAwesomeIcon icon={faClipboard} /> Task</p>
                <p className={styles.statValue}>{project.task}</p>
              </div>
              <div className={styles.statItem}>
                <p className={styles.statLabel}><FontAwesomeIcon icon={faCalendarDays} /> Last Update</p>
                <p className={styles.statValue}>{project.lastUpdate}</p>
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

      <div className={"paginationContainer"}>
        <div className={"paginationInfo"}>
          Showing {startItem} - {endItem} of {projects.length}
        </div>
        <div className="paginationControls">
          <span className="paginationInfo">
            Page <input
              type="number"
              value={currentPage}
              onChange={(e) => handlePageChange(Number(e.target.value))}
              min="1"
              max={totalPages}
            />{" "}
            / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
