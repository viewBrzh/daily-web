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
import { useRouter } from 'next/router';
import LoadingModal from "@/components/common/loadingModa";


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
  const router = useRouter();

  const [authenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const handleAddProjectClick = () => {
    setIsModalOpen(true);
  };

  const hadleSuccess = async () => {
    setIsModalOpen(false);
    const user_id = localStorage.getItem("user_id");
    const data = await fetchProjects(parseInt(user_id || "0"), debouncedSearchValue, currentPage, sort);
    setProjects(data.projects);
    setTotalPage(data.total_page);
    settotalRow(data.total_row);
  }

  const handleCloseModal = async () => {
    setIsModalOpen(false);
  };

  const searchPayload = {
    label: 'Search',
    placeholder: 'project name',
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
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchValue]);

  useEffect(() => {
    const fetchProjectData = async () => {
      setIsLoading(true);
      try {
        const user_id = localStorage.getItem("user_id");
        const data = await fetchProjects(parseInt(user_id || "0"), debouncedSearchValue, currentPage, sort);
        const projectData = data.projects;
        
        setProjects(projectData);
        setTotalPage(data.total_page);
        settotalRow(data.total_row);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoading(false);
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setAuthenticated(true);
    }
  }, []);

  if (authenticated === null) {
    return <p>Loading...</p>;
  }

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
      <AddProjectModal isOpen={isModalOpen} onClose={handleCloseModal} onSuccess={hadleSuccess} />
      <LoadingModal isLoading={isLoading} />
    </Layout>
  );
};

export default MyTasks;
