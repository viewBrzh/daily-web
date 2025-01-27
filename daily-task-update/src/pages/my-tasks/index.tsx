import React, { useState, useEffect } from "react";
import styles from "@/styles/mytask.module.css";
import Layout from "@/components/layout/layout";
import ProjectCard from "@/views/my-tasks/projectCard";
import PageContainer from "@/components/layout/pageContainer";
import AddProjectModal from "@/components/common/modal/addProjectModal";
import SearchBar from "@/components/common/searchBar";
import { NewProject, Project } from "@/views/my-tasks/types";
import { fetchProjects } from "../api/my-task/getProject";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const MyTasks: React.FC = () => {
  const itemsPerPage = 6;
  const [totalPage, setTotalPage] = useState(1);
  const [totalRow, settotalRow] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<NewProject>({
    projectCode: '',
    name: '',
    description: '',
    start_date: new Date(),
    end_date: new Date(),
  });
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);

  const handleAddProjectClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const searchPayload = {
    label: 'Search',
    placeholder: 'project name/Code',
    value: searchValue,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value),
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500); // 500ms delay

    return () => clearTimeout(debounceTimer); // Cleanup the timer
  }, [searchValue]);

  // Fetch projects when debouncedSearchValue changes
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const data = await fetchProjects(1, debouncedSearchValue, currentPage); // Pass the debounced value
        const projectData = data.projects;
        setProjects(projectData);
        setTotalPage(data.totalPage);
        settotalRow(data.totalRow);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjectData();
  }, [debouncedSearchValue, currentPage]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPage) {
      setCurrentPage(page);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage;
  const endItem = startItem + projects.length;

  return (
    <Layout>
      <SearchBar payload={searchPayload} />
      <PageContainer title={"My Project"}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Project List</h1>
            <button className='btn' onClick={handleAddProjectClick}><FontAwesomeIcon icon={faPlus} /> Add Project</button>
          </div>
          <ProjectCard pageData={projects} />
        </div>
        <div className={"paginationContainer"}>
          <div className={"paginationInfo"}>
            Showing {startItem + 1} - {endItem} of {totalRow}
          </div>
          <div className="paginationControls">
            <span className="paginationInfo">
              Page <input
                type="number"
                value={currentPage}
                onChange={(e) => handlePageChange(Number(e.target.value))}
                min="1"
                max={totalPage}
              />{" "}
              / {totalPage}
            </span>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPage}
            >
              &gt;
            </button>
          </div>
        </div>
      </PageContainer>
      <AddProjectModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </Layout>
  );
};

export default MyTasks;
