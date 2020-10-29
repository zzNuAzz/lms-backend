const { ApolloServer } = require('apollo-server-express');
const fs = require('fs');

const ScalarDate = require('./ScalarDate');
const {
    permission: { mustBeLogin, mustBeTeacher, mustBeStudent },
} = require('./users');
const users = require('./users');
const courses = require('./courses');
const threads = require('./threads');
const documents = require('./documents');
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
        threadList: mustBeLogin(threads.getThread),
    },
    Mutation: {
        createUserAccount: users.createUser,
        updateUserProfile: mustBeLogin(users.updateUserProfile),
        updateUserPassword: mustBeLogin(users.updateUserPassword),
        uploadAvatar: mustBeLogin(users.uploadAvatar),

        enrollCourse: mustBeStudent(courses.enrollCourse),
        updateCourseMember: mustBeTeacher(courses.updateCourseMember),

        createThread: mustBeLogin(threads.createThread),
        editThread: mustBeLogin(threads.editThread),

        createDocument: mustBeTeacher(documents.createDocument),
    },
    Date: ScalarDate,
};

const server = new ApolloServer({
    resolvers,
    typeDefs: fs.readFileSync(`${__dirname}/schema.graphql`, 'utf-8'),
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
