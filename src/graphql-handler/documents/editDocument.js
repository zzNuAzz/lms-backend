const db = require('../../models');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');

const createDocument = async (_, args, { userCtx }) => {
    const { documentId, title, description } = args;
    try {
        if (userCtx.error) throw new AuthenticationError(userCtx.error);
        const {
            user: { userId: authorId },
        } = userCtx;

        const document = await db.Documents.findByPk(documentId);
        if (document == null) {
            throw new UserInputError('Document does not exist');
        }
        if (document['author_id'] !== authorId) {
            throw new AuthenticationError(
                'You does not have permission to edit this document!'
            );
        }
        if (title) {
            document['title'] = title;
            document['update_at'] = Date.now();
        }
        if (description) {
            document['description'] = description;
            document['update_at'] = Date.now();
        }
        await document.save();
        return { success: true };
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
