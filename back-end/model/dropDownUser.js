const db = require('../util/db');

module.exports = class Project {
    constructor(username, empId, fullName) {
        this.username = username;
        this.empId = empId;
        this.fullName = fullName;
    }

    static async getUserDropdown(searchValue, page = 1) {
        try {
            // Set the offset based on the page number and limit the results to 5 users
            const limit = 5;
    
            const userQuery = `SELECT * FROM users WHERE fullname LIKE '%${searchValue}%' OR username LIKE '%${searchValue}%' LIMIT ${limit}`;
            const finalResult = await db.execute(userQuery);
            return finalResult;
        } catch (err) {
            throw err;
        }
    }
    
}