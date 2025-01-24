import React, { useState } from 'react';
import styles from '@/styles/modal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProjectModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [currentPage, setCurrentPage] = useState(1);
  const [projectName, setProjectName] = useState('');
  const [projectManager, setProjectManager] = useState('');
  const [teamMembers, setTeamMembers] = useState<{ name: string; role: string }[]>([]);
  const [newMember, setNewMember] = useState({ name: '', role: '' });

  const handleNext = () => {
    setCurrentPage(2);
  };

  const handleBack = () => {
    setCurrentPage(1);
  };

  const handleAddMember = () => {
    if (newMember.name && newMember.role) {
      setTeamMembers([...teamMembers, newMember]);
      setNewMember({ name: '', role: '' });
    }
  };

  const handleSubmit = () => {
    console.log('Project Name:', projectName);
    console.log('Project Manager:', projectManager);
    console.log('Team Members:', teamMembers);
    onClose();
  };

  const handleDeleteMember = (indexToDelete: number) => {
    setTeamMembers(teamMembers.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className={styles.modalOverlay}>
      {currentPage === 1 && (
        <div className={styles.modal}>
          <h2>Add Project</h2>
          <div className={styles.formGroup}>
            <label>Project Name</label>
            <input
              type="text"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Project Manager</label>
            <input
              type="text"
              placeholder="Enter project manager"
              value={projectManager}
              onChange={(e) => setProjectManager(e.target.value)}
              required
            />
          </div>
          <div className={styles.formActions}>
            <button type="button" className="cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="btn" onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
      )}
      {currentPage === 2 && (
        <div className={styles.modal}>
          <h2>Add Member</h2>
          <div className={styles.tableContainer}>
            <table className={styles.teamTable}>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th className={styles.thDelete} ></th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{member.name}</td>
                    <td>{member.role}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className={styles.deleteRowButton}
                        onClick={() => handleDeleteMember(index)}
                        aria-label="Delete"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.addMember}>
            <input
              type="text"
              placeholder="Name"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Role"
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
            />
            <button className="btn-second" onClick={handleAddMember}>
              +
            </button>
          </div>
          <div className={styles.formActions}>
            <button type="button" className="cancel" onClick={handleBack}>
              Back
            </button>
            <button className="btn" onClick={handleSubmit}>
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProjectModal;
