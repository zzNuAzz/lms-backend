const db = require('../../models');
const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');
const sequelize = require('sequelize');

const getThread = async (_, args, { userCtx }) => {
    const { threadId } = args;
    if (userCtx.error) throw new AuthenticationError(userCtx.error);
    const {
        user: { userId, role },
    } = userCtx;

    const thread = await db.ForumThreads.findOne({
        where: snakeCase({ threadId }),
        attributes: { include: [
            [
              sequelize.literal('(SELECT COUNT(*) FROM ThreadPosts WHERE ForumThreads.thread_id = ThreadPosts.thread_id)'), 'postCount'
            ],
          ]},
        include: ['author', 'course'],
        raw: true,
        nest: true,
    });

    if(thread === null) {
        throw new UserInputError("Thread does not exist.");
    }

    const course = thread.course;

    if (role === 'Teacher' && course['host_id'] !== userId) {
        throw new AuthenticationError(
            'You does not have permission with this course!'
        );
    }
    if (role === 'Student') {
        const filter = { userId, courseId: course['course_id'], status: 'Accepted' };
        const member = await db.CourseMembers.findOne({
            where: snakeCase(filter),
        });
        if (member == null) {
            throw new AuthenticationError(
                'You does not have permission with this course!'
            );
        }
    }

    return camelCase(thread);
};
module.exports = getThread;
