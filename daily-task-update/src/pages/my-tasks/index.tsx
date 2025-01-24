import React, { useState } from "react";
import styles from "@/styles/mytask.module.css";
import Layout from "@/components/layout/layout";
import ProjectCard from "@/views/my-tasks/projectCard";
import PageContainer from "@/components/layout/pageContainer";
import AddProjectModal from "@/components/common/modal/addProjectModal";
import SearchBar from "@/components/common/searchBar";

const MyTasks: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [searchProjectName, setSearchProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectCode, setProjectCode] = useState('');


  const handleAddProjectClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    // Handle form submission (e.g., send data to API or update state)
    console.log('Project Added:', { projectCode, projectName, projectDescription });
    setIsModalOpen(false);
  };

  const handleSubmitSearch = () => {
    // Handle form submission (e.g., send data to API or update state)
    console.log('Searching:', { searchProjectName });
  };

  const searchPayload = {
    label: 'Search',
    placeholder: 'project name/Code',
    value: searchProjectName,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSearchProjectName(e.target.value),
    onSubmit: handleSubmitSearch,
  };

  return (
    <Layout>
      <SearchBar payload={searchPayload} />
      <PageContainer title={"My Project"}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Project List</h1>
            <button className='btn' onClick={handleAddProjectClick}>+ Add Project</button>
          </div>
          <ProjectCard />
        </div>
      </PageContainer>
      <AddProjectModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </Layout>
  );
};

export default MyTasks;
