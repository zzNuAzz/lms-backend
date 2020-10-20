module.exports = (sequelize, Sequelize) => {
    const Courses = sequelize.define('Courses', {
        course_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        host_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        description: {
            type: Sequelize.STRING,
        },
    });

    Courses.associate = models => {
        Courses.hasMany(models.CourseMembers, {
            foreignKey: 'course_id',
            sourceKey: 'course_id',
        });
        Courses.hasMany(models.ForumThreads, {
            foreignKey: 'course_id',
            sourceKey: 'course_id',
        });
        Courses.hasMany(models.Assignments, {
            foreignKey: 'course_id',
            sourceKey: 'course_id',
        });
        Courses.hasMany(models.Documents, {
            foreignKey: 'course_id',
            sourceKey: 'course_id',
        });
        Courses.belongsTo(models.Users, {
            as: 'host',
            foreignKey: 'host_id',
            targetKey: 'user_id',
        });
    };
    return Courses;
};
