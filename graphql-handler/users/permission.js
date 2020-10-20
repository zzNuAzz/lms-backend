const { AuthenticationError } = require('apollo-server-express');
// HOC for graphql resolver
const mustBeLogin = resolver => (root, args, { userCtx }) => {
    if (!userCtx == null || !userCtx.signedIn) {
        throw new AuthenticationError('You must be signed first');
    }
    return resolver(root, args, { userCtx });
};

const mustBeTeacher = resolver => (root, args, { userCtx }) => {
    if (!userCtx == null || !Ctx.signedIn) {
        throw new AuthenticationError('You must be signed first');
    }
    if (userCtx.role !== 'Teacher') {
        throw new AuthenticationError("You don't have permission");
    }
    return resolver(root, args, { userCtx });
};

const mustBeStudent = resolver => (root, args, { userCtx }) => {
    if (!userCtx == null || !userCtx.signedIn) {
        throw new AuthenticationError('You must be signed first');
    }
    if (userCtx.role !== 'Student') {
        throw new AuthenticationError("You don't have permission");
    }
    return resolver(root, args, { userCtx });
};

module.exports = {
    mustBeLogin,
    mustBeTeacher,
    mustBeStudent,
};
