const AuthenModel = require("../model/authenModel");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body; // Destructure for cleaner code
        const response = await AuthenModel.login(email, password); // Await the promise
        res.status(200).json(response); // Send the response from the login method
    } catch (error) {
        res.status(500).json({
            message: 'Failed to Login',
            error: error.message
        });
    }
};

exports.signUp = async (req, res) => {
    try {
        const { email, password, fullName, empId } = req.body; // Destructure for cleaner code
        const response = await AuthenModel.signUp(email, password, fullName, empId); // Await the promise
        res.status(200).json(response); // Send the response from the login method
    } catch (error) {
        res.status(500).json({
            message: 'Failed to Login',
            error: error.message
        });
    }
};


exports.logout = async (req, res) => {
    try {
        const response = await AuthenModel.logout(); // Await the promise
        res.status(200).json(response); // Send the response from the login method
    } catch (error) {
        res.status(500).json({
            message: 'Failed to Login',
            error: error.message
        });
    }
};

exports.resetPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    try {
        const response = await AuthenModel.resetPassword(email);
        if (response.success) {
            return res.status(200).json({ message: response.message });
        } else {
            return res.status(400).json({ error: response.message });
        }
    } catch (error) {
        console.error("Error during password reset:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const {new_password, access_token, refresh_token} = req.body;
        const response = await AuthenModel.updatePassword(new_password, access_token, refresh_token);
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json({ error: response.message });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

