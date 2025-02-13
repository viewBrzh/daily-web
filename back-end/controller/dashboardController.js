const DashboardModal = require("../model/dashboardModal");

exports.getProjectDashboard = async (req, res) => {
    try {
        const projectId = req.body.projectId;
        const response = DashboardModal.getProjectDashboard(projectId);
        res.status(200).json(await response);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch dashboard',
            error: error.message
        });
    }
};


