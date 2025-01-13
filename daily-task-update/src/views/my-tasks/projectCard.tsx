import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/mytask.module.css";
import { Project, NewProject } from "./types";
import { fetchProjects } from "@/pages/api/my-task/getProject";
import StatusBadge from "./statusBadge";

const ProjectCard: React.FC = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<NewProject>({
    title: '',
    lastUpdate: '',
    status: '',
  });
  const totalPages = Math.ceil(projects.length / itemsPerPage);


  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const data = await fetchProjects(); // Use the imported getProjects function
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects');
      }
    };
    fetchProjectData(); // Call the renamed function
  }, []);
  

  const handleViewProject = (projectId: string) => {
    router.push("/view-project/" + projectId);
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

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, projects.length);

  return (
    <div>
      <div className={styles.projects}>
        {currentProjects.map((project, index) => (
          <div
            key={index}
            className={styles.projectCard}
            onClick={() => handleViewProject(project.projectId.toString())}
          >
            <div className={styles.projectCardHeader}>
              <h2>{project.title}</h2>
              <StatusBadge status={project.status} />
            </div>
            {/* <p>Team member: {project.member}</p> */}
            <p>Last Update: {project.lastUpdate}</p>
            {/* <p>Responsible Role: {project.responsibleRole}</p> */}
          </div>
        ))}
      </div>
      <div className={styles.paginationContainer}>
        <div className={styles.paginationInfo}>
          Showing {startItem} - {endItem} of {projects.length}
        </div>
        <div className={styles.paginationControls}>
          <span className={styles.paginationInfo}>
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
