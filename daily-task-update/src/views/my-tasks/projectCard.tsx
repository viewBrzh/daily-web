import React, { useState } from "react";
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
    { projectId: "4", title: "Project A", status: "Inactive", member: "8", responsibleRole: "Back-end Dev", lastUpdate: "11/09/2545", pm: "John Doe (view)" },
    { projectId: "5", title: "Project B", status: "Active", member: "10", responsibleRole: "Full-stack Dev", lastUpdate: "15/10/2545", pm: "Jane Smith (view)" },
    { projectId: "6", title: "Project C", status: "Inactive", member: "7", responsibleRole: "Designer", lastUpdate: "18/08/2545", pm: "Sarah Connor (view)" },
    { projectId: "7", title: "Project D", status: "Active", member: "5", responsibleRole: "Tester", lastUpdate: "20/07/2545", pm: "Michael Scott (view)" },
    { projectId: "8", title: "Project E", status: "Inactive", member: "6", responsibleRole: "Product Manager", lastUpdate: "22/06/2545", pm: "Dwight Schrute (view)" },
    { projectId: "9", title: "Project F", status: "Active", member: "9", responsibleRole: "Data Scientist", lastUpdate: "25/05/2545", pm: "Jim Halpert (view)" },
    { projectId: "10", title: "Project G", status: "Inactive", member: "3", responsibleRole: "DevOps Engineer", lastUpdate: "30/04/2545", pm: "Pam Beesly (view)" },
    { projectId: "11", title: "Project H", status: "Active", member: "4", responsibleRole: "UX Designer", lastUpdate: "05/03/2545", pm: "Angela Martin (view)" },
    { projectId: "12", title: "Project I", status: "Inactive", member: "2", responsibleRole: "Tech Lead", lastUpdate: "12/02/2545", pm: "Oscar Martinez (view)" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const router = useRouter();

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
            onClick={() => handleViewProject(project.projectId)}
          >
            <div className={styles.projectCardHeader}>
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
            </div>
            <p>Team member: {project.member}</p>
            <p>Last Update: {project.lastUpdate}</p>
            <p>Responsible Role: {project.responsibleRole}</p>
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
