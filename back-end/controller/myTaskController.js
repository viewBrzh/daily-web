const { findMyTasks } = require("../model/mytaskModel");

exports.getMyTasks = async (req, res) => {
    try {
      const projects = findMyTasks();
      res.status(200).json((await projects).results);
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch courses',
        error: error.message
      });
    }
};
