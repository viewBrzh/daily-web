const db = require('../util/db');

module.exports = class Member {
    constructor(userId, projectId, role) {
        this.userId = userId;
        this.projectId = projectId;
        this.role = role;
    }

    static async updateTeamMember(newMembers, projectId) {

        try {
            const [existingMembers] = await db.query(
                "SELECT userId, role FROM projectMembers WHERE projectId = ?",
                [projectId]
            );

            const existingUserIds = new Set(existingMembers.map(member => member.userId));
            const newUserIds = new Set(newMembers.map(member => member.userId));

            // Identify members to add
            const membersToAdd = newMembers.filter(member => !existingUserIds.has(member.userId));

            // Identify members to delete
            const membersToDelete = [...existingUserIds].filter(userId => !newUserIds.has(userId));

            // Identify members whose role needs to be updated
            const membersToUpdateRole = newMembers.filter(member => {
                const existingMember = existingMembers.find(m => m.userId === member.userId);
                return existingMember && existingMember.role !== member.role;
            });

            // Add new members
            if (membersToAdd.length > 0) {
                const values = membersToAdd.map(member => [member.userId, projectId, member.role]);
                await db.query(
                    "INSERT INTO projectMembers (userId, projectId, role) VALUES ?",
                    [values]
                );
            }

            // Delete removed members
            if (membersToDelete.length > 0) {
                await db.query(
                    "DELETE FROM projectMembers WHERE projectId = ? AND userId IN (?)",
                    [projectId, membersToDelete]
                );
            }

            // Update roles for existing members
            if (membersToUpdateRole.length > 0) {
                for (const member of membersToUpdateRole) {
                    await db.query(
                        "UPDATE projectMembers SET role = ? WHERE userId = ? AND projectId = ?",
                        [member.role, member.userId, projectId]
                    );
                }
            }

            return { membersToAdd, membersToDelete, membersToUpdateRole };

        } catch (error) {
            throw new Error('Error updating members: ' + error.message);
        }
    }

    static async getUser(userId) {
        try {
            const query = `
                SELECT userId, username, fullName, empId
                FROM users 
                WHERE userId = ?;
            `;

            const [rows] = await db.execute(query, [userId]); 
            return rows;
        } catch (err) {
            throw err;
        }
    }

};
