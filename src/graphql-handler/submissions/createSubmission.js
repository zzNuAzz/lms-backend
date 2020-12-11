const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');
const db = require('../../models');
const helps = require('../../helps');

const createSubmission = async (_, args, { userCtx }) => {
    try {
        if (userCtx.error) throw new AuthenticationError(userCtx.error);
        const { user: { userId: authorId } } = userCtx;
        const { assignmentId, description, files } = args.submission;

        const assignment = await db.Assignments.findOne({
            include:[{ 
                association: 'course', include:[{
                    association: 'members', 
                    where: {
                        ['status']: 'Accepted', 
                        ['user_id']: authorId
                    }
                }]
            }],
            where: {['assignment_id']: assignmentId},
            raw: true
        });

        if(assignment === null) {
            throw new AuthenticationError("You does not have permission with this course!");
        }
        
		const submissionFiles = await helps.saveFileMultiple(files, 'submission');
        const submission = await db.Submissions.create(
			snakeCase({
				assignmentId,
				authorId,
				description,
				createAt: Date.now(),
				updateAt: Date.now(),
			})
        )
		const insertedId = submission.toJSON()['submission_id'];
        await db.SubmissionFiles.bulkCreate(
            submissionFiles.map(file => {
                file['submission_id'] = insertedId;
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
module.exports = createSubmission;
