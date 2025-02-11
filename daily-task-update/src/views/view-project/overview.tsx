import React, { useEffect, useState } from "react";
import stylesModal from "@/styles/modal/modal.module.css";
import styles from "@/styles/view-project/overview.module.css";
import { Member, UpdateProject, ViewProject } from "@/components/common/types";
import UserDropdown from "@/components/common/drop-down/userDropDown";
import { faCircleInfo, faPeopleGroup, faTrash, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateMember } from "@/pages/api/my-task/member";
import { updateProject } from "@/pages/api/my-task/project";

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

const initUpdateData = {
    projectId: 0,
    projectCode: "",
    name: "",
    description: "",
    start_date: new Date(),
    end_date: new Date(),
    status: "",
}

const Overview: React.FC<OverviewProps> = ({ projectData, memberData, isOverview, projectId }) => {
    if (isOverview !== "Overview") return null;

    const [project, setProject] = useState<ViewProject>(projectData);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingMember, setIsEditingMember] = useState(false);
    const [teamMembers, setTeamMembers] = useState<Member[]>(memberData);
    const [newMember, setNewMember] = useState<NewMember>({ userId: 0, fullName: "", role: "" });
    const [updateProjectData, setUpdateProjectData] = useState<UpdateProject>(initUpdateData);

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
        const updateData = {
            projectId: project.projectId,
            projectCode: project.projectCode,
            name: project.name,
            description: project.description,
            start_date: project.start_date,
            end_date: project.end_date,
            status: project.status,
        }
        setUpdateProjectData(updateData);
        updateProject(updateData);
        console.log(updateProjectData);
    };

    const saveTeamMembersChanges = async () => {
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
                    <h1 className={styles.title}><FontAwesomeIcon className={styles.icon} icon={faCircleInfo} /> Details</h1>
                    {isEditing ? (
                        <div>
                            <button className='cancel' onClick={handleCancel}>Cancel</button>
                            <button className='btn' onClick={handleSave}>Save</button>
                        </div>
                    ) : (
                        <button className="btn" onClick={handleEdit}>Update</button>
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
                    <h1 className={styles.title}><FontAwesomeIcon className={styles.icon} icon={faPeopleGroup} /> Members ({teamMembers.length})</h1>
                    {isEditingMember ? (
                        <div>
                            <button className='cancel' onClick={handleCancelMember}>Cancel</button>
                            <button className='btn' onClick={handleSaveMember}>Save</button>
                        </div>
                    ) : (
                        <button className="btn" onClick={handleEditMember}>Update</button>
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
