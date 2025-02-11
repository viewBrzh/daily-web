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

    static async getCalendarByDate(projectId, date) {
        try {
            const query = `
                SELECT c.id, c.title, c.description, location, DATE_FORMAT(c.date, '%Y-%c-%e') AS date, u.fullName as created_by
                FROM calendar c
                JOIN users u ON c.created_by = u.userId
                WHERE c.projectId = ? AND DATE(c.date) = ?
            `;
            const [result] = await db.query(query, [projectId, date]);
            return { result };
        } catch (err) {
            throw err;
        }
    }

    static async addCalendar(projectId, title, description, location, date, createdBy) {
        try {
            const query = `
                INSERT INTO calendar (projectId, title, description, location, date, created_by)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const [result] = await db.query(query, [projectId, title, description, location, date, createdBy]);
            return { result };
        } catch (err) {
            throw err;
        }
    }
    
    static async deleteCalendar(id) {
        try {
            const [result] = await db.execute(
                "DELETE FROM calendar WHERE id = ?", 
                [id]
            );
            return result;
        } catch (err) {
            throw err;
        }
    }
}
