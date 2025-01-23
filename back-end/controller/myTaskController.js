const Mytasks = require("../model/myTaskModel");

exports.getMyTasks = async (req, res) => {
    try {
      const resUserId = req.body.resUserId;
      const myTasks = Mytasks.findMyTasks(resUserId);
      res.status(200).json((await myTasks).finalResults);
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch courses',
        error: error.message
      });
    }
};
