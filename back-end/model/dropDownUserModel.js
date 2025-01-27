const db = require('../util/db');

module.exports = class Project {
    constructor(username, empId, fullName) {
        this.username = username;
        this.empId = empId;
        this.fullName = fullName;
    }

    static async getUserDropdown(searchValue) {
        try {
            // Set the limit to 5 users
            const limit = 5;

            // Base query for matching rows
            let userQuery = `
                (SELECT * FROM users 
                ${searchValue ? `WHERE fullName LIKE ? OR username LIKE ?` : ``}
                LIMIT ?)
                UNION
                (SELECT * FROM users 
                ${searchValue ? `WHERE NOT (fullName LIKE ? OR username LIKE ?)` : ``}
                LIMIT ?)`;

            const queryParams = [];

            // If searchValue exists, add parameters for the first SELECT
            if (searchValue) {
                queryParams.push(`%${searchValue}%`, `%${searchValue}%`);
            }
            queryParams.push(limit);

            // If searchValue exists, add parameters for the second SELECT
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
};
