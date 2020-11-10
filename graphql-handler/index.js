const { ApolloServer } = require('apollo-server-express');
const fs = require('fs');

const ScalarDate = require('../graphql/ScalarDate');
const {
    permission: { mustBeLogin, mustBeTeacher, mustBeStudent },
} = require('./users');
const users = require('./users');
const courses = require('./courses');
const threads = require('./threads');
const documents = require('./documents');
const posts = require('./posts');
const uploadFile = require('./uploadFile');
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
        documentList: mustBeLogin(documents.getDocumentList),
    },
    Mutation: {
        createUserAccount: users.createUser,
        createCourse: mustBeTeacher(courses.createCourse),
        enrollCourse: mustBeStudent(courses.enrollCourse),
        updateCourseMember: mustBeTeacher(courses.updateCourseMember),
        updateCourse: mustBeTeacher(courses.updateCourse),
        updateUserProfile: mustBeLogin(users.updateUserProfile),
        updateUserPassword: mustBeLogin(users.updateUserPassword),
        uploadAvatar: mustBeLogin(users.uploadAvatar),

        createThread: mustBeLogin(threads.createThread),
        editThread: mustBeLogin(threads.editThread),

        createPost: mustBeLogin(posts.createPost),
        editPost: mustBeLogin(posts.editPost),
        // getPost: mustBeLogin(posts.getPost),
        createDocument: mustBeTeacher(documents.createDocument),
        editDocument: mustBeTeacher(documents.editDocument),
        uploadFileSingle: mustBeLogin(uploadFile.single),
        uploadFileMultiple: mustBeLogin(uploadFile.multiple),
    },
    Date: ScalarDate,
};

const server = new ApolloServer({
    resolvers,
    typeDefs: fs.readFileSync(
        `${__dirname}/../graphql/schema.graphql`,
        'utf-8'
    ),
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
