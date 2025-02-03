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
    const { projectCode, name, description, start_date, end_date } = req.body.project;
    const users = req.body.users;
    console.log(users);
    console.log( projectCode,
      name,
      description,
      start_date,
      end_date
    );
    console.log(res.body);
      

    if (!projectCode || !name || !start_date || !end_date) {
      return res.status(400).json({
        message: 'Missing required fields: projectCode, name, description, start_date, end_date',
      });
    }

    const descriptionValue = description && description?.trim() !== '' ? description : "";

    const startDate = start_date?.slice(0, 19).replace('T', ' ');
    const endDate = end_date?.slice(0, 19).replace('T', ' ');
    const result = ProjectModel.addProject(projectCode, name, descriptionValue, startDate, endDate);

    const projectId = await result;

    if (!Array.isArray(users) || users.length === 0) {
      res.status(201).json({
        message: 'Project added successfully',
        project: {
          projectId: projectId,
          projectCode,
          name,
          description,
          start_date,
          end_date
        }
      });
    }

    const membersRes = await ProjectModel.addMembers(projectId, users);

    res.status(201).json({
      message: 'Project added successfully',
      project: {
        projectId: projectId,
        projectCode,
        name,
        description,
        start_date,
        end_date
      },
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
    const { projectId , userId } = req.body;
    const result = ProjectModel.getViewProject(projectId, userId);
    res.status(200).json({
      project: (await result).projectResult[0],
      tasks: (await result).mytasksResult[0],
      members: (await result).projectMembers[0],
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
}
