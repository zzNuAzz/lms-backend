const db = require('../../models');
const bcrypt = require('bcrypt');
const { snakeCase, camelCase } = require('change-case-object');

// check username + password login
const verifyUser = async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).send({
            code: 400,
            error: 'Authenticate failed!!!',
            message: 'Missing username or password.',
        });
        return;
    }

    const result = await db.Users.findOne({ where: { username }, raw: true });

    if (!result) {
        res.status(400).send({
            code: 400,
            error: 'Authenticate failed!!!',
            message: 'Username or password does not correct.',
        });
        return;
    }

    const { password: storePassword } = result;
    bcrypt
        .compare(password, storePassword)
        .then(check => {
            if (check === false) {
                res.status(401).send({
                    status: 401,
                    error: 'Authenticate failed!!!',
                    message: 'Username or password does not correct.',
                });
                return;
            }
            const user = camelCase(result);
            delete user.password;
            // store to next middleware
            res.locals.user = { ...user };
            next();
        })
        .catch(err => {
            res.status(500).send({ error: err });
        });
};
module.exports = verifyUser;
