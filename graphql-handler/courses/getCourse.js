const db = require('../../models');
const { snakeCase, camelCase } = require('change-case-object');

const getCourse = async (_, { courseId }, { userCtx }) => {
    const filter = { courseId };

    const course = await db.Courses.findOne({
        include: [{ model: db.Users, as: 'host' }],
        where: snakeCase(filter),
        nest: true,
        raw: true,
    });

    return camelCase(course);
};

module.exports = getCourse;
