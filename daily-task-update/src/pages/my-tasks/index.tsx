import React, { useState, useEffect } from "react";
import styles from "@/styles/my-project/mytask.module.css";
import Layout from "@/components/layout/layout";
import ProjectCard from "@/views/my-tasks/projectCard";
import PageContainer from "@/components/layout/pageContainer";
import AddProjectModal from "@/components/common/modal/addProjectModal";
import SearchBar from "@/components/common/searchBar";
import { Project } from "@/components/common/types";
import { fetchProjects } from "../api/my-task/project";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const MyTasks: React.FC = () => {
  const itemsPerPage = 6;
  const [totalPage, setTotalPage] = useState(1);
  const [totalRow, settotalRow] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [sort, setSort] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
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

  const handleSort = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = e.target;
    setSort(value);
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
        const data = await fetchProjects(1, debouncedSearchValue, currentPage, sort); 
        const projectData = data.projects;
        setProjects(projectData);
        setTotalPage(data.totalPage);
        settotalRow(data.totalRow);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjectData();
  }, [debouncedSearchValue, currentPage, sort]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPage) {
      setCurrentPage(page);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage;
  const endItem = startItem + projects?.length;

  return (
    <Layout>
      <SearchBar payload={searchPayload} />
      <PageContainer title={"My Project"}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.divContainer}>
              <h2>Project List</h2>
              <select onChange={handleSort}>
                <option value='last-update'>Last updated</option>
                <option value='name'>Name</option>
                <option value='status'>Status</option>
              </select>
            </div>
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
