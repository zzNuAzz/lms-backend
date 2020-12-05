module.exports = (sequelize, Sequelize) => {
    const Documents = sequelize.define('Documents', {
        document_id: {
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
        update_at: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        create_at: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.TEXT,
        },
    });

    Documents.associate = models => {
        Documents.belongsTo(models.Courses, {
            foreignKey: 'course_id',
            targetKey: 'course_id',
            as: 'course'
        });
        Documents.hasMany(models.DocumentFiles, {
            foreignKey: 'document_id',
            sourceKey: 'document_id',
            as: 'files',
        });
    };
    return Documents;
};
