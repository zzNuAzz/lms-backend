const jwt = require('jsonwebtoken');
const JWT_SECRET = require('config').get('jwt');

const getUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return { signedIn: false };
    try {
        const credentials = jwt.verify(token, JWT_SECRET);
        return credentials;
    } catch (error) {
        return { signedIn: false };
    }
};

module.exports = getUser;
