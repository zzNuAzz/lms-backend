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

        short_description: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        description: {
            type: Sequelize.TEXT,
            allowNull: false
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
            onDelete: 'CASCADE',
            hooks: true, 
        });
        Courses.hasMany(models.ForumThreads, {
            foreignKey: 'course_id',
            sourceKey: 'course_id',
        });
        Courses.hasMany(models.Assignments, {
            foreignKey: 'course_id',
            sourceKey: 'course_id',
            as: 'assignments',
            onDelete: 'CASCADE',
            hooks: true, 
        });
        Courses.hasMany(models.Documents, {
            foreignKey: 'course_id',
            sourceKey: 'course_id',
            'as': 'courses',
            onDelete: 'CASCADE',
            hooks: true, 
        });
        Courses.belongsTo(models.Users, {
            foreignKey: 'host_id',
            targetKey: 'user_id',
            as: 'host',
        });
    };
    return Courses;
};
