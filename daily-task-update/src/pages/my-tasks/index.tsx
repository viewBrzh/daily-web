import React, { useState } from "react";
import styles from "@/styles/mytask.module.css";
import Layout from "@/components/layout/layout";
import ProjectCard from "@/views/my-tasks/projectCard";
import PageContainer from "@/components/layout/pageContainer";
import Modal from "@/components/common/modal/modal";

const MyTasks: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const handleAddProjectClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    // Handle form submission (e.g., send data to API or update state)
    console.log('Project Added:', { projectName, projectDescription });
    setIsModalOpen(false);
  };

  const modalPayload = {
    title: 'Add New Project',
    fields: [
      {
        label: 'Project Name',
        placeholder: 'Enter project name',
        value: projectName,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value),
      },
      {
        label: 'Project Description',
        placeholder: 'Enter project description',
        value: projectDescription,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setProjectDescription(e.target.value),
      },
    ],
    onSubmit: handleSubmit,
  };

  return (
    <Layout>
      <PageContainer title={"My Project"}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Project List</h1>
            <button className={styles.addProjectBtn} onClick={handleAddProjectClick}>Add Project</button>
          </div>
          <ProjectCard />
        </div>
      </PageContainer>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} payload={modalPayload}/>
    </Layout>
  );
};

export default MyTasks;
