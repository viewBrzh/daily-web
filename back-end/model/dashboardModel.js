const db = require('../util/db');

module.exports = class Dashboard {

    static async getProjectDashboard(projectId) {
        try {
            // Query for task status count
            const taskStatusQuery = `SELECT ts.name AS status, COUNT(t.taskId) AS count 
                                     FROM tasks t
                                     LEFT JOIN task_status ts ON t.statusId = ts.statusId
                                     WHERE t.projectId = ? 
                                     GROUP BY ts.name`;

            // Query for sprint progress dynamically
            const sprintProgressQuery = `SELECT s.sprintName, 
                                            COUNT(t.taskId) AS totalTasks,
                                            JSON_OBJECTAGG(ts.name, COALESCE(sc.statusCount, 0)) AS statusCount
                                        FROM sprints s
                                        LEFT JOIN tasks t ON s.sprintId = t.sprintId
                                        LEFT JOIN (
                                            SELECT t.sprintId, t.statusId, COUNT(*) AS statusCount
                                            FROM tasks t
                                            GROUP BY t.sprintId, t.statusId
                                        ) sc ON s.sprintId = sc.sprintId
                                        LEFT JOIN task_status ts ON sc.statusId = ts.statusId
                                        WHERE s.projectId = ?
                                        GROUP BY s.sprintId, s.sprintName`;

            // Query for project member count
            const memberQuery = `SELECT role, COUNT(*) AS count 
                                 FROM projectmembers 
                                 WHERE projectId = ? 
                                 GROUP BY role`;

            // Fetch data for task status, sprint progress, and project members
            const [taskStatus] = await db.query(taskStatusQuery, [projectId]);
            const [sprintProgress] = await db.query(sprintProgressQuery, [projectId]);

            // Parse the statusCount JSON string into a proper object
            sprintProgress.forEach(sprint => {
                if (sprint.statusCount) {
                    sprint.statusCount = JSON.parse(sprint.statusCount);
                }
            });

            const [members] = await db.query(memberQuery, [projectId]);

            return { taskStatus, sprintProgress, members };

        } catch (err) {
            console.log('Error:', err);
            throw err;
        }
    }
};
