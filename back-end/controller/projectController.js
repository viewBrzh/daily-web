const ProjectModel = require("../model/projectModel");

exports.getAllProject = async (req, res) => {
  try {
    const myProject = await ProjectModel.getAllProjects(); // Await the async function
    res.status(200).json(myProject);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
};

exports.getMyProject = async (req, res) => {
  try {
    const { resUserId, searchValue, page, sortBy } = req.body;
    const myProject = await ProjectModel.findMyProject(resUserId, searchValue, page, sortBy); // Await the result

    res.status(200).json({
      projects: myProject.finalResults,
      total_page: myProject.totalPages,
      total_row: myProject.totalProjects,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
};

exports.addProject = async (req, res) => {
  try {
    const { project_code, name, description, start_date, end_date } = req.body.project;
    const users = req.body.users;

    console.log(users, project_code, name, description, start_date, end_date);

    // Check if all required fields are present
    if (!project_code || !name || !start_date || !end_date) {
      return res.status(400).json({
        message: 'Missing required fields: project_code, name, description, start_date, end_date',
      });
    }

    // Ensure description is a non-empty string
    const descriptionValue = description?.trim() !== '' ? description : "";
    
    // Format date fields if necessary
    const startDate = start_date?.slice(0, 19).replace('T', ' ');
    const endDate = end_date?.slice(0, 19).replace('T', ' ');

    // Add the project and get its ID
    const projectId = await ProjectModel.addProject(project_code, name, descriptionValue, startDate, endDate);

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(201).json({
        message: 'Project added successfully',
        project: { projectId, project_code, name, description, start_date, end_date }
      });
    }

    // Add members to the project
    const membersRes = await ProjectModel.addMembers(projectId, users);

    // Return success with project and members details
    res.status(201).json({
      message: 'Project added successfully',
      project: { projectId, project_code, name, description, start_date, end_date },
      membersRes
    });
  } catch (error) {
    console.error('Error adding new project:', error.message);
    res.status(500).json({
      message: 'Failed to add new project',
      error: error.message,
    });
  }
};

exports.getViewProject = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    // Validate inputs
    if (!projectId || !userId) {
      return res.status(400).json({
        message: 'Missing projectId or userId in request body',
      });
    }

    const parsedProjectId = parseInt(projectId, 10);
    const parsedUserId = parseInt(userId, 10);

    if (isNaN(parsedProjectId) || isNaN(parsedUserId)) {
      return res.status(400).json({
        message: 'Invalid projectId or userId. Must be integers.',
      });
    }

    const result = await ProjectModel.getViewProject(parsedProjectId, parsedUserId);

    if (!result.projectResult) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({
      project: result.projectResult,
      tasks: result.mytasksResult,
      members: result.projectMembers,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch project details',
      error: error.message,
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { project_id, project_code, name, description, start_date, end_date, status } = req.body.project;
    const result = await ProjectModel.updateProject(project_id, project_code, name, description, start_date, end_date, status); // Await result

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update project',
      error: error.message
    });
  }
};
