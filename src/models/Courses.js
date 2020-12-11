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
            type: Sequelize.TEXT,
        },
        
        create_at: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        update_at: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    });

    Courses.associate = models => {
        Courses.hasMany(models.CourseMembers, {
            foreignKey: 'course_id',
            sourceKey: 'course_id',
            as: 'members',
        });
        Courses.hasMany(models.ForumThreads, {
            foreignKey: 'course_id',
            sourceKey: 'course_id',
        });
        Courses.hasMany(models.Assignments, {
            foreignKey: 'course_id',
            sourceKey: 'course_id',
            as: 'assignments',
        });
        Courses.hasMany(models.Documents, {
            foreignKey: 'course_id',
            sourceKey: 'course_id',
            'as': 'courses',
        });
        Courses.belongsTo(models.Users, {
            foreignKey: 'host_id',
            targetKey: 'user_id',
            as: 'host',
        });
    };
    return Courses;
};
