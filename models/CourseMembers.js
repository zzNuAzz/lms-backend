module.exports = (sequelize, Sequelize) => {
    const CourseMembers = sequelize.define('CourseMembers', {
        course_member_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        course_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        role: {
            type: Sequelize.ENUM,
            values: ['host', 'member'],
            defaultValue: 'member',
            allowNull: false,
        },

        description: {
            type: Sequelize.STRING,
        },
    });

    CourseMembers.associate = models => {
        CourseMembers.belongsTo(models.Courses, {
            foreignKey: 'course_id',
            targetKey: 'course_id',
        });
        CourseMembers.belongsTo(models.Users, {
            foreignKey: 'user_id',
            targetKey: 'user_id',
        });
    };
    return CourseMembers;
};
