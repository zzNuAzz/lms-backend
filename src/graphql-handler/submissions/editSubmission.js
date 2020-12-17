const db = require('../../models');
const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');
const { parseObject, saveFileMultiple } = require('../../helps');

const editSubmission = async (_, { changes }, { userCtx }) => {
  	try {
		if (userCtx.error) throw new AuthenticationError(userCtx.error);
		const { submissionId, description, removeFileId, newFiles } = changes;
		const {
			user: { userId, role },
		} = userCtx;
		
		const submission = await db.Submissions.findOne({
			include: ['author', 'files', {association: 'assignment', include: ['course']}],
			where: snakeCase({submissionId}),
			nest: true
		});

		if(submission === null) {
			throw new UserInputError("Submission does not exist.");
		}

		if (role === 'Teacher' && submission.assignment.course['host_id'] !== userId) {
			throw new AuthenticationError('You does not have permission!');
		}
		if (role === 'Student' && submission['author_id'] !== userId) {
		throw new AuthenticationError("You does not have permission!")
		}

		const submissionFiles = await saveFileMultiple(newFiles, 'submission');

		const files = parseObject(submission.files);
        const removeFile = files.map(file => file['submission_file_id']).filter(id => {
            return removeFileId.includes(id);
        });
        if(removeFile || newFiles) {
            submission['update_at'] = Date.now();
        }

		if(description) {
			submission.description = description;
			submission['update_at'] = Date.now();
		}

		await Promise.all([
            submission.save(), 
            removeFile && db.SubmissionFiles.destroy({ where: { ['submission_file_id']: removeFile }}),
            newFiles && db.SubmissionFiles.bulkCreate(submissionFiles.map(file => {
                    file['submission_id'] = submissionId;
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
module.exports = editSubmission;
