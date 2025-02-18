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
        const { start_date, end_date, sprintName, projectId } = req.body.newSprint;
        console.log(start_date, end_date, sprintName, projectId);
        
        if (!start_date || !end_date || !sprintName || !projectId) {
            return res.status(400).json({
                message: 'Missing required fields',
            });
        }
        const formattedStartDate = formatDate(start_date);
        const formattedEndDate = formatDate(end_date);

        const status = await Tasks.addNewSprint(formattedStartDate, formattedEndDate, sprintName, projectId);
        res.status(200).json(status.message);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to insert sprint',
            error: error.message,
        });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { taskId, name, description, resUserId, sprintId, projectId, statusId, priority } = req.body.task;
        console.log( taskId, name, description, resUserId, sprintId, projectId, statusId, priority);

        const status = await Tasks.updateTask( taskId, name, description, resUserId, sprintId, projectId, statusId, priority);
        res.status(200).json(status);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to insert sprint',
            error: error.message,
        });
    }
};

const formatDate = (date) => {
    const formattedDate = new Date(date);
    return formattedDate.toISOString().split('T')[0]; // Extracts 'YYYY-MM-DD' format
};

