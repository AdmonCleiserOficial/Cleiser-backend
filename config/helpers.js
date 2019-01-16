const User = require('../models/user');

module.exports.extractTokenFromRequest = function (req, res, next) {
    let headers = req.headers;
    let token = headers.authorization.split(' ')[1];

    User.findOne({token: token}, (err, user) => {
        if (user) {
            req.user = user;
            next();
        }
        else {
            res.status(404).json({
                message: 'User not found'
            })
        }
    });
};