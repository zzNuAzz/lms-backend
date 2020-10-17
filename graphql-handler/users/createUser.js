const { camelCase, snakeCase } = require('change-case-object');
const { UserInputError } = require('apollo-server-express');
const bcrypt = require('bcrypt');
const config = require('config');
const db = require('../../models');
const { checkUsername } = require('./index');

const validateUsernameAndPassword = async user => {
    const { username, password: plainPassword, role } = user;
    const errors = [];
    if (!username) {
        errors.push('Username must be required.');
    }
    if (!plainPassword) {
        errors.push('Password must be required.');
    }
    const validateUsername = await checkUsername(null, { username });
    if (username && !validateUsername) {
        errors.push('Username is already in use.');
    }

    if (errors.length > 0) {
        throw new UserInputError('Invalid username or password input', {
            errors,
        });
    }
};

const SALT_ROUNDS = config.get('bcrypt_salt') || 10;

const createUser = async (_, { user: userInput }) => {
    //validate input
    await validateUsernameAndPassword(userInput);

    const user = await db.Users.create(
        {
            ...userInput,
            password: await bcrypt.hash(userInput.password, SALT_ROUNDS),
        },
        { raw: true }
    );
    console.log(user.get({ plain: true }));

    return camelCase(user.get({ plain: true }));
};

module.exports = createUser;
