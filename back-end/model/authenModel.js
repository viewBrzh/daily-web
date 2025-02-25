const db = require('../util/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const SECRET_KEY = 'your_jwt_secret';

class AuthModel {
    // Login method
    static async login(username, password) {
        try {
            const query = `SELECT * FROM users WHERE username = ? AND is_verified = 1`; // Only allow login if verified
            const [rows] = await db.query(query, [username]);

            if (rows.length === 0) {
                return { success: false, message: "User not found or email not verified" };
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

    // Sign Up method with email verification
    static async signup(username, password, fullName, email) {
        try {
            // Check if the user already exists
            const checkQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
            const [existingUser] = await db.query(checkQuery, [username, email]);

            if (existingUser.length > 0) {
                return { success: false, message: "Username or email is already taken" };
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a verification token
            const verificationToken = crypto.randomBytes(32).toString('hex');

            // Insert the new user into the database with is_verified = false
            const insertQuery = `INSERT INTO users (username, password, fullName, email, verificationToken, is_verified) VALUES (?, ?, ?, ?, ?, ?)`;
            const [result] = await db.query(insertQuery, [username, hashedPassword, fullName, email, verificationToken, false]);

            // Send verification email
            await sendVerificationEmail(email, verificationToken);

            return { 
                success: true, 
                message: "Signup successful. Please check your email to verify your account."
            };
        } catch (error) {
            throw error;
        }
    }

    // Email verification method
    static async verifyEmail(token) {
        try {
            const query = `SELECT * FROM users WHERE verificationToken = ? AND is_verified = false`;
            const [user] = await db.query(query, [token]);

            if (user.length === 0) {
                return { success: false, message: "Invalid or expired token" };
            }

            const updateQuery = `UPDATE users SET is_verified = true, verificationToken = NULL WHERE verificationToken = ?`;
            await db.query(updateQuery, [token]);

            return { success: true, message: "Email successfully verified" };
        } catch (error) {
            throw error;
        }
    }
}

// Helper function to send verification email
async function sendVerificationEmail(email, verificationToken) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'viewsatview@gmail.com', // Your email
            pass: 'viewview',   // Your email password or App password
        },
    });

    const verificationUrl = `http://your-website.com/verify-email?token=${verificationToken}`;

    const mailOptions = {
        from: 'viewsativew@gmail.com',
        to: email,
        subject: 'Email Verification',
        html: `<p>Please click the link below to verify your email:</p>
               <p><a href="${verificationUrl}">Verify Email</a></p>`
    };

    await transporter.sendMail(mailOptions);
}

module.exports = AuthModel;
