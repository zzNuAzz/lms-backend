module.exports = (sequelize, Sequelize) => {
    const Submissions = sequelize.define('Submissions', {
        submission_id: {
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
            type: Sequelize.TEXT,
        },

        update_at: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        create_at: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    });

    Submissions.associate = models => {
        Submissions.belongsTo(models.Assignments, {
            foreignKey: 'assignment_id',
            targetKey: 'assignment_id',
            as: 'assignment'
        });
        Submissions.belongsTo(models.Users, {
            foreignKey: 'author_id',
            targetKey: 'user_id',
            as: 'author'
        });
        Submissions.hasMany(models.SubmissionFiles, {
            foreignKey: 'submission_id',
            sourceKey: 'submission_id',
            as: 'files'
        });
    };
    return Submissions;
};
