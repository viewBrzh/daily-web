import React, { useEffect, useState } from "react";
import stylesModal from "@/styles/my-project/modal.module.css";
import styles from "@/styles/view-project/overview.module.css";
import { Member, ViewProject } from "@/components/common/types";
import UserDropdown from "@/components/common/drop-down/userDropDown";
import { faTrash, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateMember } from "@/pages/api/my-task/member";

interface OverviewProps {
    projectData: ViewProject;
    memberData: Member[];
    isOverview: string;
    projectId: string;
}

interface NewMember {
    userId: number;
    fullName: string;
    role: string;
}

const Overview: React.FC<OverviewProps> = ({ projectData, memberData, isOverview, projectId }) => {
    if (isOverview !== "Overview") return null;

    const [project, setProject] = useState<ViewProject>(projectData);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingMember, setIsEditingMember] = useState(false);
    const [teamMembers, setTeamMembers] = useState<Member[]>(memberData);
    const [newMember, setNewMember] = useState<NewMember>({ userId: 0, fullName: "", role: "" });

    // Enable Project Editing
    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
        setProject(projectData); // Reset changes
        setIsEditing(false);
    };
    const handleSave = async () => {
        await saveProjectChanges();
        setIsEditing(false);
    };

    // Enable Member Editing
    const handleEditMember = () => setIsEditingMember(true);
    const handleCancelMember = () => {
        setTeamMembers(memberData); // Reset changes
        setIsEditingMember(false);
    };
    const handleSaveMember = async () => {
        await saveTeamMembersChanges();
        setIsEditingMember(false);
    };

    // Update Project Details
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProject((prev) => ({ ...prev, [name]: value }));
    };

    // Handle New Member Selection
    const handleUserSelect = (userId: number, fullName: string) => {
        setNewMember({ ...newMember, fullName, userId });
    };

    // Add New Member
    const handleAddMember = () => {
        if (newMember.userId && newMember.fullName && newMember.role) {
            const updatedMembers = [
                ...teamMembers,
                { userId: newMember.userId, fullName: newMember.fullName, role: newMember.role, projectId: projectId },
            ];
            setTeamMembers(updatedMembers);
            setNewMember({ userId: 0, fullName: "", role: "" });
        }
    };

    // Delete Member
    const handleDeleteMember = (indexToDelete: number) => {
        setTeamMembers(teamMembers.filter((_, index) => index !== indexToDelete));
    };

    // Update Member Role
    const handleMemberRoleChange = (index: number, role: string) => {
        setTeamMembers((prev) =>
            prev.map((member, i) =>
                i === index ? { ...member, role } : member
            )
        );
    };

    useEffect(() => {
        setProject(projectData);
        setTeamMembers(memberData);
    }, [projectData, memberData]);

    const saveProjectChanges = async () => {
        console.log("Saving Project Changes...", project);
    };

    const saveTeamMembersChanges = async () => {
        console.log("Saving Team Members...", teamMembers);
        const response = await updateMember(projectId, teamMembers);
        console.log(response);
    };

    const formatDateForInput = (dateString: string | null) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().split("T")[0];
    };

    return (
        <div className={styles.overviewContainer}>
            {/* Project Overview Section */}
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>📖 Project Overview</h1>
                    {isEditing ? (
                        <div>
                            <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
                            <button className={styles.saveButton} onClick={handleSave}>Save</button>
                        </div>
                    ) : (
                        <button className="btn" onClick={handleEdit}>Edit</button>
                    )}
                </div>

                <div className={styles.details}>
                    <label>Project Name:</label>
                    <input type="text" name="name" value={project.name} onChange={handleChange} disabled={!isEditing} />

                    <label>Project Code:</label>
                    <input type="text" name="projectCode" value={project.projectCode} onChange={handleChange} disabled={!isEditing} />

                    <label>Description:</label>
                    <input type="text" name="description" value={project.description} onChange={handleChange} disabled={!isEditing} />

                    <label>Start Date:</label>
                    <input type="date" name="start_date" value={formatDateForInput(project.start_date.toString())} onChange={handleChange} disabled={!isEditing} />

                    <label>End Date:</label>
                    <input type="date" name="end_date" value={formatDateForInput(project.end_date.toString())} onChange={handleChange} disabled={!isEditing} />

                    <label>Status:</label>
                    <select name="status" value={project.status} onChange={handleChange} disabled={!isEditing} className={styles.statusSelect}>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="on-planning">On Planning</option>
                    </select>
                </div>
            </div>

            {/* Team Members Section */}
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>👥 Members</h1>
                    {isEditingMember ? (
                        <div>
                            <button className={styles.cancelButton} onClick={handleCancelMember}>Cancel</button>
                            <button className={styles.saveButton} onClick={handleSaveMember}>Save</button>
                        </div>
                    ) : (
                        <button className="btn" onClick={handleEditMember}>Edit</button>
                    )}
                </div>
                <div className={stylesModal.tableContainer}>
                    <table className={stylesModal.teamTable}>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Name</th>
                                <th>Role</th>
                                {isEditingMember && <th className={stylesModal.thDelete}></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {teamMembers.map((member, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{member.fullName}</td>
                                    <td>
                                        {isEditingMember ? (
                                            <input
                                                type="text"
                                                value={member.role}
                                                onChange={(e) => handleMemberRoleChange(index, e.target.value)}
                                            />
                                        ) : (
                                            member.role
                                        )}
                                    </td>
                                    {isEditingMember && (
                                        <td style={{ textAlign: "center" }}>
                                            <button className={stylesModal.deleteRowButton} onClick={() => handleDeleteMember(index)} aria-label="Delete">
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {isEditingMember && (
                    <div className={stylesModal.addMember}>
                        <UserDropdown onSelectUser={handleUserSelect} />
                        <input type="text" placeholder="Role" value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} className={stylesModal.inputRow} />
                        <button className="btn-second" onClick={handleAddMember}>
                            <FontAwesomeIcon icon={faUserPlus} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Overview;
