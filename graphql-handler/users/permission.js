const { AuthenticationError } = require('apollo-server-express');
// HOC for graphql resolver
const mustBeLogin = resolver => (root, args, { userCtx }) => {
    if (!userCtx || !userCtx.signedIn || !userCtx.user) {
        userCtx.error = 'You must be signed first.';
    }
    return resolver(root, args, { userCtx });
};

const mustBeTeacher = resolver => (root, args, { userCtx }) => {
    if (!userCtx || !userCtx.signedIn || !userCtx.user) {
        userCtx.error = 'You must be signed first.';
    } else if (userCtx.user.role !== 'Teacher') {
        userCtx.error = "You don't have permission. This only for Teacher.";
    }

    return resolver(root, args, { userCtx });
};

const mustBeStudent = resolver => (root, args, { userCtx }) => {
    if (!userCtx || !userCtx.signedIn || !userCtx.user) {
        userCtx.error = 'You must be signed first.';
    } else if (userCtx.user.role !== 'Student') {
        userCtx.error = "You don't have permission. This only for Student.";
    }
    return resolver(root, args, { userCtx });
};

module.exports = {
    mustBeLogin,
    mustBeTeacher,
    mustBeStudent,
};
