const db = require('../../models');
const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');
const { parseObject } = require('../../helps');

const getDocument = async (_, args, { userCtx }) => {
    const { documentId } = args;
    if (userCtx.error) throw new AuthenticationError(userCtx.error);
    const {
        user: { userId, role },
    } = userCtx;

    const _document = await db.Documents.findOne({
        include: [ 'files', {association:'course', include:['host']} ],
        where: snakeCase({ documentId }),
        nest: true
    });
    const document = parseObject(_document);
    
    if(document === null) {
        throw new UserInputError("documentId is invalid.");
    }
    
    const course = document.course;
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
    return camelCase(document);
};
module.exports = getDocument;
