const CalendarModal = require("../model/calendarModel");

exports.getAllCalendar = async (req, res) => {
    try {
        const projectId = req.body.projectId;
        const month = req.body.month;
        
        const response = await CalendarModal.getAllCalendar(projectId, month);
        res.status(200).json(response.result);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch calendar',
            error: error.message
        });
    }
};

exports.getCalendarByDate = async (req, res) => {
    try {
        const projectId = req.body.projectId;
        const date = req.body.date;
        const response = await CalendarModal.getCalendarByDate(projectId, date);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch calendar on '+req.body.date,
            error: error.message
        });
    }
};

exports.addCalendar = async (req, res) => {
    try {
        const { projectId, title, description, location, date, created_by } = req.body;
        console.log( "projectId: ",projectId,",title: ", title,",description: ", description,",location: ", location,",date: ", date,",createdBy: ", created_by)
        const response = await CalendarModal.addCalendar(projectId, title, description, location, date, created_by);

        res.status(200).json((await response).result);
    } catch (err) {
        throw err;
    }
}

exports.deleteCalendar = async (req, res) => {
    try {
        const id = req.body.id;
        const response = await CalendarModal.deleteCalendar(id);

        res.status(200).json((await response).result);
    } catch (err) {
        throw err;
    }
}