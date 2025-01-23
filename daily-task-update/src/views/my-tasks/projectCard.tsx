import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/mytask.module.css";
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
    description: '',
    lastUpdate: '',
    status: '',
  });
  const totalPages = Math.ceil(projects.length / itemsPerPage);


  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const data = await fetchProjects("1"); // Use the imported getProjects function
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects');
      }
    };
    fetchProjectData(); // Call the renamed function
  }, []);
  

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
            <p>{project.description}</p>
            <p><strong>Responding Role: </strong> {project.role}</p>
            <p><strong>Last Update: </strong> {formatDate(project.lastUpdate)}</p>
            {/* <p>Responsible Role: {project.responsibleRole}</p> */}
          </div>
        ))}
      </div>
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
