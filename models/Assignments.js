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

        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        content: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        create_at: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        due_date: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.STRING,
        },
    });

    Assignments.associate = models => {
        Assignments.belongsTo(models.Courses, {
            foreignKey: 'course_id',
            targetKey: 'course_id',
        });
        Assignments.hasMany(models.AssignmentSubmissions, {
            foreignKey: 'assignment_id',
            sourceKey: 'assignment_id',
        });
    };
    return Assignments;
};
