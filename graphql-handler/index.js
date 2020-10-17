const { ApolloServer } = require('apollo-server-express');
const fs = require('fs');
// const { getCourseList, getCourseById, getContentById } = require('./course.js');
const {
    getUserProfileById,
    checkUsername,
    createUser,
    resolveUser,
    updateUserProfile,
    permission: { mustBeLogin, mustBeTeacher, mustBeStudent },
    updateUserPassword,
} = require('./users');
// const { resolveUser, getUser, mustBeSignedIn } = require('./userAuthenticate');

const { getUser } = require('../controllers/users');

//mapping graphql query with function
const resolvers = {
    Query: {
        userProfile: getUserProfileById,
        currentUser: resolveUser,
        usernameAvailability: checkUsername,
        // courseList: getCourseList,
        // courseDetails: getCourseById,
        // content: getContentById,
    },
    Mutation: {
        createUserAccount: createUser,
        updateUserProfile: mustBeLogin(updateUserProfile),
        updateUserPassword: mustBeLogin(updateUserPassword),
    },
};

const server = new ApolloServer({
    resolvers,
    typeDefs: fs.readFileSync(`${__dirname}/../schema.graphql`, 'utf-8'),
    formatError: error => {
        console.log(error);
        return error;
    },
    context: getContext,
    playground: true,
    introspection: true,
});

function installHandler(app) {
    // cors define here

    //apply apollo server
    server.applyMiddleware({
        app,
        path: '/api/graphql',
    });
}

// get user from graphql query by token
async function getContext({ req }) {
    const userCtx = await getUser(req);
    return { userCtx };
}

module.exports = { installHandler };
