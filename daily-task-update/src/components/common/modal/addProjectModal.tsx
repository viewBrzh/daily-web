import React, { useState } from "react";
import styles from "@/styles/my-project/modal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Member, NewProject } from "@/components/common/types";
import UserDropdown from "../drop-down/userDropDown";
import { addProject } from "@/pages/api/my-task/project";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NewMember {
  userId: number;
  name: string; 
  role: string
}

const AddProjectModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [currentPage, setCurrentPage] = useState(1);
  const [newProject, setNewProject] = useState<NewProject>({
    projectCode: "",
    name: "",
    description: "",
    start_date: new Date(),
    end_date: new Date(),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [teamMembers, setTeamMembers] = useState<Member[]>([]);
  const [newMember, setNewMember] = useState<NewMember>({ userId: 0, name: "", role: "" });

  // Validation logic
  const validatePageOne = () => {
    const validationErrors: Record<string, string> = {};
    if (!newProject.projectCode.trim()) validationErrors.projectCode = "Project Code is required!";
    if (!newProject.name.trim()) validationErrors.name = "Project Name is required!";
    if (!newProject.start_date) validationErrors.start_date = "Start Date is required!";
    if (!newProject.end_date) validationErrors.end_date = "End Date is required!";
    if (newProject.start_date >= newProject.end_date) validationErrors.end_date = "End Date is not valid!";

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleNext = () => {
    if (validatePageOne()) {
      setCurrentPage(2);
    }
  };

  const handleBack = () => {
    setCurrentPage(1);
  };

  const handleAddMember = () => {
    if (newMember.name && newMember.role) {
      setTeamMembers([...teamMembers, {
        userId: newMember.userId,
        fullName: newMember.name,
        role: newMember.role,
      }]);
      setNewMember({ userId: 0,name: "", role: "" });
    }
  };

  const handleUserSelect = (userId: number, name: string) => {
    setNewMember({ ...newMember, name, userId });
  };

  const handleSubmit = () => {
    addProject(newProject, teamMembers);
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
          {/* Form for project details */}
          <div className={styles.formGroup}>
            <label>Code</label>
            <input
              type="text"
              placeholder="Enter project code"
              value={newProject.projectCode}
              onChange={(e) => setNewProject({ ...newProject, projectCode: e.target.value })}
              required
            />
            {errors.projectCode && <span className={styles.error}>{errors.projectCode}</span>}
          </div>
          <div className={styles.formGroup}>
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter project name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              required
            />
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              placeholder="Enter project description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
          </div>
          <div className={styles.dateForm}>
            <div className={styles.dateWrapper}>
              <div className={styles.inputGroup}>
                <label>Start Date</label>
                <div className={styles.formGroup}>
                  <input
                    type="date"
                    value={newProject.start_date.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setNewProject({ ...newProject, start_date: new Date(e.target.value) })
                    }
                    required
                  />
                  {errors.start_date && <span className={styles.error}>{errors.start_date}</span>}
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label>End Date</label>
                <div className={styles.formGroup}>
                  <input
                    type="date"
                    value={newProject.end_date.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setNewProject({ ...newProject, end_date: new Date(e.target.value) })
                    }
                    required
                  />
                  {errors.end_date && <span className={styles.error}>{errors.end_date}</span>}
                </div>
              </div>
            </div>
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
                  <th className={styles.thDelete}></th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{member.fullName}</td>
                    <td>{member.role}</td>
                    <td style={{ textAlign: "center" }}>
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
            <UserDropdown onSelectUser={handleUserSelect} />
            <input
              type="text"
              placeholder="Role"
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
              className={styles.inputRow}
            />
            <button className="btn-second" onClick={handleAddMember}>
              <FontAwesomeIcon icon={faUserPlus} />
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
