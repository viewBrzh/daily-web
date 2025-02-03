import React, { useState } from "react";
import styles from "@/styles/view-project/overview.module.css";
import { ViewProject } from "@/components/common/types";

interface OverviewProps {
    pageData: ViewProject;
    isOverview: string;
}

const Overview: React.FC<OverviewProps> = ({ pageData, isOverview }) => {
    if (isOverview !== "Overview") return null;

    const [project, setProject] = useState<ViewProject>(pageData);
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () =>{ 
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleAdd = () =>{ 
        setIsEditing(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProject(prev => ({ ...prev, [name]: value }));
    };

    // Format date for input fields (YYYY-MM-DD format)
    const formatDateForInput = (dateString: string | null) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().split("T")[0];
    };

    return (
        <div className={styles.overviewContainer}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>📖 Project Overview</h1>
                    {isEditing ? (<>
                        <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
                        <button className={styles.saveButton} onClick={handleSave}>Save</button>
                        </>
                    ) : (
                        <button className={styles.editButton} onClick={handleEdit}>Edit</button>
                    )}
                </div>

                <div className={styles.details}>
                    <label>Project Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={project.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />

                    <label>Project Code:</label>
                    <input
                        type="text"
                        name="projectCode"
                        value={project.projectCode}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />

                    <label>Description:</label>
                    <input
                        type="text"
                        name="description"
                        value={project.description}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />

                    <label>Start Date:</label>
                    <input
                        type="date"
                        name="start_date"
                        value={formatDateForInput(project.start_date.toString())}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />

                    <label>End Date:</label>
                    <input
                        type="date"
                        name="end_date"
                        value={formatDateForInput(project.end_date.toString())}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />

                    <label>Status:</label>
                    <select
                        name="status"
                        value={project.status}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={styles.statusSelect}
                    >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="on-planning">On Planning</option>
                    </select>
                </div>
            </div>

            <div className={styles.card}>
            <div className={styles.header}>
                    <h1 className={styles.title}>👥 Members</h1>
                    <button className={styles.editButton} onClick={handleAdd}>Add</button>
                    
                </div>
            </div>
        </div>
    );
};

export default Overview;
