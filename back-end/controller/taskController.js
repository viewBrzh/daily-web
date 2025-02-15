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

exports.updateTaskStatus = async (req, res) => {
    try {
        const taskId = req.body.taskId;
        const statusId = req.body.statusId;
        const status = Tasks.updateTaskStatus(taskId, statusId);
        res.status(200).json((await status).message);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch task status',
            error: error.message
        });
    }
};

exports.addNewSprint = async (req, res) => {
    try {
        const {start_date, end_date, sprintName, projectId} = req.body;
        const status = Tasks.addNewSprint(start_date, end_date, sprintName, projectId);
        res.status(200).json((await status).message);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch task status',
            error: error.message
        });
    }
};


