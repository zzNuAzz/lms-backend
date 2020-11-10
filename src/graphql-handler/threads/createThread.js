const db = require('../../models');
const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');

const createThread = async (_, { courseId, title, content }, { userCtx }) => {
    try {
        if (userCtx.error) throw new AuthenticationError(userCtx.error);
        const {
            user: { userId: authorId, role },
        } = userCtx;

        const course = await db.Courses.findByPk(courseId, { raw: true });
        if (course == null) {
            throw new UserInputError('CourseId is invalid');
        }
        if (role === 'Teacher' && course['host_id'] !== authorId) {
            throw new AuthenticationError(
                'You does not have permission with this course!'
            );
        }
        if (role === 'Student') {
            const filter = { userId: authorId, courseId, status: 'Accepted' };
            const member = await db.CourseMembers.findOne({
                where: snakeCase(filter),
            });
            if (member == null) {
                throw new AuthenticationError(
                    'You does not have permission with this course!'
                );
            }
        }

        const thread = await db.ForumThreads.create(
            snakeCase({
                courseId,
                authorId,
                title,
                content,
                createAt: Date.now(),
                updateAt: Date.now(),
            })
        );
        const insertedId = camelCase(thread.toJSON()).forumThreadId;
        return {
            insertedId,
            success: true,
        };
    } catch (err) {
        if (
            !(err instanceof UserInputError) &&
            !(err instanceof AuthenticationError)
        ) {
            console.log(err);
        }
        return {
            success: false,
            message: err.message,
        };
    }
};
module.exports = createThread;
