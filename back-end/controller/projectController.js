const ProjectModel = require("../model/projectModel");

exports.getMyProject = async (req, res) => {
  try {
    const resUserId = req.body.resUserId;
    const searchValue = req.body.searchValue; 
    const page = req.body.page; 
    const myProject = ProjectModel.findMyProject(resUserId, searchValue, page);
    res.status(200).json({
      projects: (await myProject).finalResults,
      totalPage: (await myProject).totalPages,
      totalRow: (await myProject).totalProjects,
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
    const { projectCode, name, description, start_date, end_date } = req.body;
    if (!projectCode || !name || !description || !start_date || !end_date) {
      return res.status(400).json({
        message: 'Missing required fields: projectCode, name, description, start_date, end_date',
      });
    }
    ProjectModel.addProject(projectCode, name, description, start_date, end_date);
    
    res.status(201).json({
      message: 'Project added successfully',
      project: { projectCode, name, description, start_date, end_date },
    });
  } catch (error) {
    console.error('Error adding new project:', error.message);
    res.status(500).json({
      message: 'Failed to add new project',
      error: error.message,
    });
  }
};
