const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');
const db = require('../../models');
const helps = require('../../helps');

const createDocument = async (_, args, { userCtx }) => {
    const { courseId, title, description, files } = args.document;
    try {
        if (userCtx.error) throw new AuthenticationError(userCtx.error);
        const {
            user: { userId: authorId },
        } = userCtx;
        const course = await db.Courses.findByPk(courseId, { raw: true });
        if (course == null) {
            throw new UserInputError('Course does not exist');
        }
        if (course['host_id'] !== authorId) {
            throw new AuthenticationError(
                'You does not have permission to create!'
            );
        }

        const documentFiles = await helps.saveFileMultiple(files, 'document');
        const document = await db.Documents.create(
            snakeCase({
                courseId,
                title,
                description,
                createAt: Date.now(),
                updateAt: Date.now(),
            })
        );
        const insertedId = camelCase(document.toJSON()).documentId;
        await db.DocumentFiles.bulkCreate(
            documentFiles.map(file => {
                file['document_id'] = insertedId;
                return file;
            })
        );

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
module.exports = createDocument;
