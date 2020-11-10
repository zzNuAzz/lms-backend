const jwt = require('jsonwebtoken');
const JWT_SECRET = require('config').get('jwt');

const generateJWT = (req, res) => {
    if (!JWT_SECRET) {
        res.status(500).send('Missing JWT_SECRET. Refusing to authenticate.');
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
        });
        res.send(credentials);
    } catch (error) {
        console.log(error);
        res.status(403).send({ code: 403, message: 'Invalid credentials.' });
    }
};

module.exports = generateJWT;
