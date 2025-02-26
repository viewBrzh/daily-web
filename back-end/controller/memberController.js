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
            result.membersToAdd?.length === 0 &&
            result.membersToDelete?.length === 0 &&
            result.membersToUpdateRole?.length === 0
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
        const user = await Member.getUser(userId);
        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}