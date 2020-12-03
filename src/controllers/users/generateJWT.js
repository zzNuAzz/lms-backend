const jwt = require('jsonwebtoken');
const JWT_SECRET = require('config').get('jwt');

const generateJWT = (req, res) => {
    if (!JWT_SECRET) {
        res.send({code:500, error: 'Missing JWT_SECRET. Refusing to authenticate.'});
        return;
    }
    try {
        const user = res.locals;
        const credentials = {
            ...user,
            signedIn: true,
        };
        const token = jwt.sign(credentials, JWT_SECRET);
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
        });
        res.send({ code: 200, credentials });
    } catch (error) {
        console.log(error);
        res.send({ code: 403, message: 'Invalid credentials.' });
    }
};

module.exports = generateJWT;
