const Tasks = require("../model/taskModel");

exports.getSprintByProject = async (req, res) => {
    try {
        const projectId = req.body.projectId;
        const sprints = Tasks.getSprintByProject(projectId);
        res.status(200).json((await sprints));
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch sprint',
            error: error.message
        });
    }
};

exports.getCurrentSprint = async (req, res) => {
    try {
        const projectId = req.body.projectId;
        const sprint = Tasks.getCurrentSprint(projectId);
        res.status(200).json((await sprint));
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch sprint',
            error: error.message
        });
    }
};

exports.getPersonFilterOption = async (req, res) => {
    try {
        const sprintId = req.body.sprintId;
        const personFilterOption = Tasks.getPersonFilterOption(sprintId);
        res.status(200).json((await personFilterOption));
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch filter option',
            error: error.message
        });
    }
};

exports.getTask = async (req, res) => {
    try {
        const sprintId = req.body.sprintId;
        const userId = req.body.userId;
        const tasks = Tasks.getTask(sprintId, userId);
        res.status(200).json((await tasks));
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch task',
            error: error.message
        });
    }
};

exports.getTaskStatus = async (req, res) => {
    try {
        const status = Tasks.getTaskStatus();
        res.status(200).json((await status));
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch task status',
            error: error.message
        });
    }
};




