const CalendarModal = require("../model/calendarModal");

exports.getAllCalendar = async (req, res) => {
  try {
    const projectId = req.body.projectId;
    const month = req.body.month;
    const response = CalendarModal.getAllCalendar(projectId, month);
    res.status(200).json((await response).result);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch calendar',
      error: error.message
    });
  }
};