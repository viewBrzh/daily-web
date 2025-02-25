const db = require('../util/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_jwt_secret';

class AuthModel {
    static async login(username, password) {
        try {
            const query = `SELECT * FROM users WHERE username = ?`;
            const [rows] = await db.query(query, [username]);

            if (rows.length === 0) {
                return { success: false, message: "User not found" };
            }

            const user = rows[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return { success: false, message: "Invalid credentials" };
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user.userId, username: user.username },
                SECRET_KEY,
                { expiresIn: '1h' }
            );

            return { 
                success: true, 
                token,
                user: { id: user.userId, username: user.username, fullName: user.fullName }
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AuthModel;
