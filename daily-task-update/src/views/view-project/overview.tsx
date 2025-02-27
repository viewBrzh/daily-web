import React, { useEffect, useState } from "react";
import stylesModal from "@/styles/modal/modal.module.css";
import styles from "@/styles/view-project/overview.module.css";
import { Member, UpdateProject, ViewProject } from "@/components/common/types";
import UserDropdown from "@/components/common/drop-down/userDropDown";
import { faCircleInfo, faPeopleGroup, faTrash, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateMember } from "@/pages/api/my-task/member";
import { updateProject } from "@/pages/api/my-task/project";
import LoadingModal from "@/components/common/loadingModa";

interface OverviewProps {
    projectData: ViewProject;
    memberData: Member[];
    projectId: string;
}

interface NewMember {
    user_id: number;
    full_name: string;
    role: string;
}

const initUpdateData = {
    project_id: 0,
    project_code: "",
    name: "",
    description: "",
    start_date: new Date(),
    end_date: new Date(),
    status: "",
}

const Overview: React.FC<OverviewProps> = ({ projectData, memberData, projectId }) => {

    const [project, setProject] = useState<ViewProject>(projectData);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingMember, setIsEditingMember] = useState(false);
    const [teamMembers, setTeamMembers] = useState<Member[]>(memberData);
    const [newMember, setNewMember] = useState<NewMember>({ user_id: 0, full_name: "", role: "" });
    const [updateProjectData, setUpdateProjectData] = useState<UpdateProject>(initUpdateData);
    
    const [isLoading, setIsLoading] = useState(false);

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
        setProject(projectData); // Reset changes
        setIsEditing(false);
    };
    const handleSave = async () => {
        await saveProjectChanges();
        setIsEditing(false);
    };

    const handleEditMember = () => setIsEditingMember(true);
    const handleCancelMember = () => {
        setTeamMembers(memberData); // Reset changes
        setIsEditingMember(false);
    };
    const handleSaveMember = async () => {
        await saveTeamMembersChanges();
        setIsEditingMember(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProject((prev) => ({ ...prev, [name]: value }));
    };

    const handleUserSelect = (userId: number, fullName: string) => {
        setNewMember({ ...newMember, full_name: fullName, user_id: userId });
    };

    const handleAddMember = () => {
        if (newMember.user_id && newMember.full_name && newMember.role) {
            const updatedMembers = [
                ...teamMembers,
                { user_id: newMember.user_id, full_name: newMember.full_name, role: newMember.role, project_id: projectId },
            ];
            setTeamMembers(updatedMembers);
            setNewMember({ user_id: 0, full_name: "", role: "" });
        }
    };

    const handleDeleteMember = (indexToDelete: number) => {
        setTeamMembers(teamMembers.filter((_, index) => index !== indexToDelete));
    };

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
            project_id: project.project_id,
            project_code: project.project_code,
            name: project.name,
            description: project.description,
            start_date: project.start_date,
            end_date: project.end_date,
            status: project.status,
        }
        setUpdateProjectData(updateData);
        const response = await updateProject(updateData);
        console.log(response);
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
            <div className="card">
                <div className="header">
                    <h1 className="title"><FontAwesomeIcon className={styles.icon} icon={faCircleInfo} /> Details</h1>
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
                    <input type="text" name="project_code" value={project.project_code} onChange={handleChange} disabled={!isEditing} />

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
            <div className="card">
                <div className="header">
                    <h1 className="title"><FontAwesomeIcon className={styles.icon} icon={faPeopleGroup} /> Members ({teamMembers.length})</h1>
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
                                    <td>{member.users.full_name}</td>
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
            <LoadingModal isLoading={isLoading} />
        </div>
    );
};

export default Overview;
