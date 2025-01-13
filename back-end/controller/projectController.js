const ProjectModel = require("../model/projectModel");

exports.getAllProject = async (req, res) => {
    try {
      const projects = ProjectModel.findAll();
      res.status(200).json((await projects).results);
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch courses',
        error: error.message
      });
    }
};
