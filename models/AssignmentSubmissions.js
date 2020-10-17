module.exports = (sequelize, Sequelize) => {
    const AssignmentSubmissions = sequelize.define('AssignmentSubmissions', {
        assignment_submission_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        author_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        assignment_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        description: {
            type: Sequelize.STRING,
        },
    });

    AssignmentSubmissions.associate = models => {
        AssignmentSubmissions.belongsTo(models.Assignments, {
            foreignKey: 'assignment_id',
            targetKey: 'assignment_id',
        });
        AssignmentSubmissions.hasMany(models.SubmissionFiles, {
            foreignKey: 'assignment_submission_id',
            sourceKey: 'assignment_submission_id',
        });
    };
    return AssignmentSubmissions;
};
