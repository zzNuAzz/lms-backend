module.exports = (sequelize, Sequelize) => {
    const Assignments = sequelize.define('Assignments', {
        assignment_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        course_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        // host_id: {
        //     type: Sequelize.INTEGER,
        //     allowNull: false,
        // },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false,
        },

        create_at: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        update_at: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        due_date: {
            type: Sequelize.STRING,
        },
    });

    Assignments.associate = models => {
        Assignments.belongsTo(models.Courses, {
            foreignKey: 'course_id',
            targetKey: 'course_id',
            as: "course"
        });
        // Assignments.belongsTo(models.Users, {
        //     foreignKey: 'host_id',
        //     targetKey: 'user_id',
        //     as: "author"
        // });
        Assignments.hasMany(models.AssignmentFiles, {
            foreignKey: 'assignment_id',
            sourceKey: 'assignment_id',
            as: 'files',
        });
        Assignments.hasMany(models.Submissions, {
            foreignKey: 'assignment_id',
            sourceKey: 'assignment_id',
        });

    };
    return Assignments;
};
