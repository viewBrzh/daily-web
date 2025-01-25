import React, { useState, useEffect } from "react";
import styles from "@/styles/mytask.module.css";
import Layout from "@/components/layout/layout";
import ProjectCard from "@/views/my-tasks/projectCard";
import PageContainer from "@/components/layout/pageContainer";
import AddProjectModal from "@/components/common/modal/addProjectModal";
import SearchBar from "@/components/common/searchBar";
import { NewProject, Project } from "@/views/my-tasks/types";
import { fetchProjects } from "../api/my-task/getProject";

const MyTasks: React.FC = () => {
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
        const data = await fetchProjects(1, debouncedSearchValue); // Pass the debounced value
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjectData();
  }, [debouncedSearchValue]);

  return (
    <Layout>
      <SearchBar payload={searchPayload} />
      <PageContainer title={"My Project"}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Project List</h1>
            <button className='btn' onClick={handleAddProjectClick}>+ Add Project</button>
          </div>
          <ProjectCard pageData={projects}/>
        </div>
      </PageContainer>
      <AddProjectModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </Layout>
  );
};

export default MyTasks;
