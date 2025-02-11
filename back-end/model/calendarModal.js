const db = require('../util/db');

module.exports = class Mytasks {

    static async getAllCalendar(projectId, month) {
        try {
            const query = `
                SELECT c.id, c.title, c.description, location, DATE_FORMAT(c.date, '%Y-%c-%e') AS date, u.fullName as created_by
                FROM calendar c
                JOIN users u ON c.created_by = u.userId
                WHERE c.projectId = ? AND MONTH(c.date) = ?
            `;
            const [result] = await db.query(query, [projectId, month]);
            return { result };
        } catch (err) {
            throw err;
        }
        
    }
    
}
