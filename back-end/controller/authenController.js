const AuthenModel = require("../model/authenModel");

exports.login = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const response = AuthenModel.login(username, password);
        res.status(200).json((await response));
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch calendar',
            error: error.message
        });
    }
};