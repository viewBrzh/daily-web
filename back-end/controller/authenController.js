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
