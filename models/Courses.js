module.exports = (sequelize, Sequelize) => {
    const Courses = sequelize.define('Courses', {
        course_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        description: {
            type: Sequelize.STRING,
        },

        // create_at: {
        //     type: Sequelize.STRING,
        //     allowNull: false,
        // },
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
    };
    return Courses;
};
