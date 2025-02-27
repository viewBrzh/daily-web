import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cthfnaaoskttzptrovht.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = class Member {
    constructor(userId, projectId, role) {
        this.userId = userId;
        this.projectId = projectId;
        this.role = role;
    }

    static async updateTeamMember(newMembers, projectId) {
        try {
            // Ensure newMembers is an array
            if (!Array.isArray(newMembers)) {
                throw new Error('newMembers must be an array');
            }

            // Fetch existing members
            const { data: existingMembers, error: fetchError } = await supabase
                .from('project_members')
                .select('user_id, role')
                .eq('project_id', projectId);

            if (fetchError) {
                throw new Error('Error fetching existing members: ' + fetchError.message);
            }

            const existingUserIds = new Set(existingMembers?.map(member => member.user_id));
            const newUserIds = new Set(newMembers.map(member => member.userId));

            // Identify members to add
            const membersToAdd = newMembers.filter(member => !existingUserIds.has(member.userId));

            // Identify members to delete
            const membersToDelete = [...existingUserIds].filter(userId => !newUserIds.has(userId));

            // Identify members whose role needs to be updated
            const membersToUpdateRole = newMembers.filter(member => {
                const existingMember = existingMembers.find(m => m.user_id === member.userId);
                return existingMember && existingMember.role !== member.role;
            });

            // Add new members
            if (membersToAdd.length > 0) {
                const { error: addError } = await supabase
                    .from('project_members')
                    .upsert(membersToAdd.map(member => ({
                        user_id: member.userId,
                        project_id: projectId,
                        role: member.role,
                    })));

                if (addError) {
                    throw new Error('Error adding new members: ' + addError.message);
                }
            }

            // Delete removed members
            if (membersToDelete.length > 0) {
                const { error: deleteError } = await supabase
                    .from('project_members')
                    .delete()
                    .in('user_id', membersToDelete)
                    .eq('project_id', projectId);

                if (deleteError) {
                    throw new Error('Error deleting members: ' + deleteError.message);
                }
            }

            // Update roles for existing members
            if (membersToUpdateRole.length > 0) {
                for (const member of membersToUpdateRole) {
                    const { error: updateError } = await supabase
                        .from('project_members')
                        .update({ role: member.role })
                        .eq('user_id', member.userId)
                        .eq('project_id', projectId); // Fixed incorrect column name

                    if (updateError) {
                        throw new Error('Error updating member role: ' + updateError.message);
                    }
                }
            }
            const Member = require("../model/memberModel");

exports.updateTeamMember = async (req, res) => {
    let { projectId, members } = req.body;
    projectId = Number(projectId);

    if (isNaN(projectId)) {
        console.log("projectId must be a valid number");
        return res.status(400).json({ error: "projectId must be a valid number" });
    }

    console.log("Updating team members for project:", projectId);
    console.log("Received members:", members);

    try {
        const result = await Member.updateTeamMember(members, projectId);

        console.log("Members to add:", result.membersToAdd);
        console.log("Members to delete:", result.membersToDelete);
        console.log("Members to update role:", result.membersToUpdateRole);

        if (
            result.membersToAdd.length === 0 &&
            result.membersToDelete.length === 0 &&
            result.membersToUpdateRole.length === 0
        ) {
            return res.status(400).json({ message: "No changes made to the team members." });
        }

        res.status(200).json({
            message: "Team members updated successfully",
            added: result.membersToAdd,
            deleted: result.membersToDelete,
            role_update: result.membersToUpdateRole,
        });

    } catch (error) {
        console.error("Error updating members:", error);
        res.status(500).json({
            message: "Failed to update project members",
            error: error.message
        });
    }
};

exports.getUser = async (req, res) => {
    try {
        const userId = req.body.userId;
        console.log("Fetching user with ID:", userId);
        const user = await Member.getUser(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({
            error: error.message
        });
    }
};

            console.log("Members to add:", membersToAdd);
            console.log("Members to delete:", membersToDelete);
            console.log("Members to update role:", membersToUpdateRole);


            return { membersToAdd, membersToDelete, membersToUpdateRole };

        } catch (error) {
            return { success: false, message: 'Error updating members: ' + error.message };
        }
    }

    static async getUser(userId) {
        try {
            // Fetch user data
            const { data: user, error } = await supabase
                .from('users')
                .select('user_id, email, full_name, emp_id')
                .eq('user_id', userId)
                .single();  // Expecting a single user

            if (error) {
                throw new Error('Error fetching user: ' + error.message);
            }

            return user;
        } catch (err) {
            throw err;
        }
    }
};
