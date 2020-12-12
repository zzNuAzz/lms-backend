const db = require('../../models');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');

const deleteDocument = async (_, args, { userCtx }) => {
    const { documentId } = args;
    try {
        if (userCtx.error) throw new AuthenticationError(userCtx.error);
        const {
            user: { userId: authorId },
        } = userCtx;

        const document = await db.Documents.findByPk(documentId, {
			include: 'course'
		});
        if (document == null) {
            throw new UserInputError('Document does not exist');
        }
        if (document.course['host_id'] !== authorId) {
            throw new AuthenticationError(
                'You does not have permission to delete this document!'
            );
		}
		
        await document.destroy();

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
module.exports = deleteDocument;
