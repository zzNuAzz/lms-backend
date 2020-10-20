const { snakeCase, camelCase } = require('change-case-object');
const db = require('../../models');

const createCourseMember = async (_, args, { userCtx }) => {
    const { courseId, userId, status, description } = args;
    const {
        user: { userId: callerId },
    } = userCtx;
    
    try {
        
    } catch (err) {
        console.log(err);
        return {
            success: false,
            message: err.message,
        };
    }
};
