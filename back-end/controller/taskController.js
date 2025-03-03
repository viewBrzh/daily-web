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
        const { start_date, end_date, sprint_name, project_id } = req.body.newSprint;
        console.log(start_date, end_date, sprint_name, project_id);
        
        if (!start_date || !end_date || !sprint_name || !project_id) {
            return res.status(400).json({
                message: 'Missing required fields',
            });
        }
        const formattedStartDate = formatDate(start_date);
        const formattedEndDate = formatDate(end_date);

        const status = await Tasks.addNewSprint(formattedStartDate, formattedEndDate, sprint_name, project_id);
        res.status(200).json(status);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to insert sprint',
            error: error.message,
        });
    }
};

exports.updateSprint = async (req, res) => {
    try {
        const { sprint_id, start_date, end_date, sprint_name } = req.body.newSprint;
        
        if (!start_date || !end_date || !sprint_name) {
            return res.status(400).json({
                message: 'Missing required fields',
            });
        }
        const formattedStartDate = formatDate(start_date);
        const formattedEndDate = formatDate(end_date);

        const status = await Tasks.updateSprint(sprint_id, formattedStartDate, formattedEndDate, sprint_name);
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
        const { task_id, name, description, res_user_id, sprint_id, project_id, status_id, priority } = req.body.task;
        console.log( task_id, name, description, res_user_id, sprint_id, project_id, status_id, priority);

        const status = await Tasks.updateTask( task_id, name, description, res_user_id, sprint_id, project_id, status_id, priority );
        res.status(200).json(status);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to insert sprint',
            error: error.message,
        });
    }
};

exports.insertTask = async (req, res) => {
    try {
        const { name, description, res_user_id, sprint_id, project_id, status_id, priority } = req.body.task;

        // Ensure required fields have valid values
        if (!name) {
            return res.status(400).json({ message: 'Task name is required' });
        }

        const newTask = {
            name,
            description: description.trim() || null,
            res_user_id: res_user_id || null,
            sprint_id: sprint_id || null, 
            project_id: parseInt(project_id) || null, 
            status_id: status_id || 1,
            priority: priority || null
        };

        console.log(newTask)

        await Tasks.insertTask(newTask);
        res.status(200).json({
            message: 'Task inserted successfully',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to insert task',
            error: error.message,
        });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const taskId= req.body.taskId;
        await Tasks.deleteTask(taskId);
        res.status(200).json("Delete task success");
    } catch (error) {
        res.status(500).json({
            message: 'Failed to delete task',
            error: error.message,
        });
    }
};

const formatDate = (date) => {
    const formattedDate = new Date(date);
    return formattedDate.toISOString().split('T')[0]; // Extracts 'YYYY-MM-DD' format
};

