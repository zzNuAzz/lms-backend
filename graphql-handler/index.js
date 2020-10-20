const { ApolloServer } = require('apollo-server-express');
const fs = require('fs');
const users = require('./users');
const {
    permission: { mustBeLogin, mustBeTeacher, mustBeStudent },
} = require('./users');
const courses = require('./courses');

const { getUser } = require('../controllers/users');

//mapping graphql query with function
const resolvers = {
    Query: {
        userProfile: users.getUserProfileById,
        userCourseList: users.getUserCourses,
        currentUser: users.resolveUser,
        usernameAvailability: users.checkUsername,
        courseList: courses.getCourseList,
        courseUserList: courses.getCourseUserList,
        course: courses.getCourse,
    },
    Mutation: {
        createUserAccount: users.createUser,
        enrollCourse: mustBeStudent(users.enrollCourse),
        updateUserProfile: mustBeLogin(users.updateUserProfile),
        updateUserPassword: mustBeLogin(users.updateUserPassword),
        updateCourseMember: mustBeTeacher(courses.updateCourseMember),
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
