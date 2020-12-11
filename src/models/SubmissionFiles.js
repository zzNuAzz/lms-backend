module.exports = (sequelize, Sequelize) => {
    const SubmissionFiles = sequelize.define('SubmissionFiles', {
        submission_file_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        submission_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        filename: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        mimetype: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        url: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        path: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    });

    SubmissionFiles.associate = models => {
        SubmissionFiles.belongsTo(models.Submissions, {
            foreignKey: 'submission_id',
            targetKey: 'submission_id',
        });
    };
    return SubmissionFiles;
};
