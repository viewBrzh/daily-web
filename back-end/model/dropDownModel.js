const db = require('../util/db');

module.exports = class Dropdown {

    static async getUserDropdown(searchValue) {
        try {
            const limit = 5;

            let userQuery = `
                (SELECT userId, username, fullName, empId FROM users 
                ${searchValue ? `WHERE fullName LIKE ? OR username LIKE ?` : ``}
                LIMIT ?)
                `;

            const queryParams = [];

            // If searchValue exists, add parameters for the first SELECT
            if (searchValue) {
                queryParams.push(`%${searchValue}%`, `%${searchValue}%`);
            }
            queryParams.push(limit);

            // Execute the query with parameters
            const [finalResult] = await db.execute(userQuery, queryParams);
            return {finalResult};
        } catch (err) {
            throw err;
        }
    }

    static async getTaskFilterDropdown(sprintId) {
        try {
            const query = `
                SELECT DISTINCT u.userId, u.username, u.fullName, u.empId
                FROM users u
                JOIN tasks t ON u.userId = t.resUserId
                WHERE t.sprintId = ?;
            `;
    
            const [rows] = await db.execute(query, [sprintId]); // Using MySQL2
            console.log(rows)
            return rows;
        } catch (err) {
            throw err;
        }
    }
       
};
