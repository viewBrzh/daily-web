const DashboardModel = require("../model/dashboardModel");

exports.getProjectDashboard = async (req, res) => {
    try {
        const projectId = req.body.projectId;
        const response = await DashboardModel.getProjectDashboard(projectId);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch dashboard',
            error: error.message
        });
    }
};


