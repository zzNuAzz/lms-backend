module.exports = (sequelize, Sequelize) => {
    const SubmissionFiles = sequelize.define('SubmissionFiles', {
        submission_file_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        assignment_submission_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        url: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        mimetype: {
            type: Sequelize.STRING,
            // values: ['pdf', 'doc', 'docx', 'xlsx', 'png', 'jpg'],
            allowNull: false,
        },
    });

    SubmissionFiles.associate = models => {
        SubmissionFiles.belongsTo(models.AssignmentSubmissions, {
            foreignKey: 'assignment_submission_id',
            targetKey: 'assignment_submission_id',
        });
    };
    return SubmissionFiles;
};
