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
const assignments = require('./assignments');
const submissions = require('./submissions');

const { getUser } = require('../controllers/users');

//mapping graphql query with function
const resolvers = {
    Query: {
        userProfile: users.getUserProfileById,
        userCourseList: mustBeStudent(users.getUserCourses),
        currentUser: users.resolveUser,
        usernameAvailability: users.checkUsername,

        courseList: courses.getCourseList,
        course: courses.getCourse,
        courseMemberList: mustBeLogin(courses.getCourseMemberList),


        thread: mustBeLogin(threads.getThread),
        threadList: mustBeLogin(threads.getThreadList),

        post: mustBeLogin(posts.getPost),
        postList: mustBeLogin(posts.getPostList),

        document: mustBeLogin(documents.getDocument),
        documentList: mustBeLogin(documents.getDocumentList),

        assignment: mustBeLogin(assignments.getAssignment),
        assignmentList: mustBeLogin(assignments.getAssignmentList),

        submission: mustBeStudent(submissions.getSubmission),
        submissionById: mustBeLogin(submissions.getSubmissionById),
        submissionList: mustBeTeacher(submissions.getSubmissionList),

    },
    Mutation: {
        createUserAccount: users.createUser,
        updateUserProfile: mustBeLogin(users.updateUserProfile),
        updateUserPassword: mustBeLogin(users.updateUserPassword),
        uploadAvatar: mustBeLogin(users.uploadAvatar),

        createCourse: mustBeTeacher(courses.createCourse),
        enrollCourse: mustBeStudent(courses.enrollCourse),
        updateCourseMember: mustBeTeacher(courses.updateCourseMember),
        updateCourse: mustBeTeacher(courses.updateCourse),
        

        createThread: mustBeLogin(threads.createThread),
        editThread: mustBeLogin(threads.editThread),

        createAssignment: mustBeTeacher(assignments.createAssignment),
        editAssignment: mustBeTeacher(assignments.editAssignment),

        createPost: mustBeLogin(posts.createPost),
        editPost: mustBeLogin(posts.editPost),
        
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
