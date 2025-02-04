const Member = require("../model/memberModel");

exports.updateTeamMember = async (req, res) => {
    let { projectId, members } = req.body;
    projectId = Number(projectId);

    if (isNaN(projectId)) {
        console.log("projectId must be a valid number");

        return res.status(400).json({ error: "projectId must be a valid number" });
    }

    try {
        const result = await Member.updateTeamMember(members, projectId);

        if (result) {
            res.status(200).json({
                message: "Team members updated successfully",
                added: result.membersToAdd, 
                deleted: result.membersToDelete 
            });
        } else {
            res.status(400).json({ error: "No changes made to the team members." });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update project members',
            error: error.message
        });
    }
};
