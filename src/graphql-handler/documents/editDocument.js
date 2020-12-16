const db = require('../../models');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');
const { parseObject, saveFileMultiple } = require('../../helps');

const editDocument = async (_, { changes }, { userCtx }) => {
    const { documentId, title, description, removeFileId, newFiles } = changes;
    try {
        if (userCtx.error) throw new AuthenticationError(userCtx.error);
        const {
            user: { userId: authorId },
        } = userCtx;

        const document = await db.Documents.findByPk(documentId, {
            include: ['course', 'files'],
        });
        if (document == null) {
            throw new UserInputError('Document does not exist');
        }
        if (document.course['host_id'] !== authorId) {
            throw new AuthenticationError(
                'You does not have permission to edit this document!'
            );
        }
        
        const documentFiles = await saveFileMultiple(newFiles, 'document');
        
        if (title) {
            document['title'] = title;
            document['update_at'] = Date.now();
        }
        if (description) {
            document['description'] = description;
            document['update_at'] = Date.now();
        }
        
        const files = parseObject(document.files);
        const removeFile = files.map(file => file['document_file_id']).filter(id => {
            return removeFileId.includes(id);
        });
        if(removeFile || newFiles) {
            document['update_at'] = Date.now();
        }
        await Promise.all([
            document.save(), 
            removeFile && db.DocumentFiles.destroy({ where: { ['document_file_id']: removeFile }}),
            newFiles && db.DocumentFiles.bulkCreate(documentFiles.map(file => {
                    file['document_id'] = documentId;
                    return file;
                })
            ),
        ]);
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
module.exports = editDocument;
