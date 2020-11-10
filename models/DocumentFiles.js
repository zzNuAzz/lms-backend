module.exports = (sequelize, Sequelize) => {
    const DocumentFiles = sequelize.define('DocumentFiles', {
        document_file_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        document_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        filename: {
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

        mimetype: {
            type: Sequelize.STRING,
            // values: ['pdf', 'doc', 'docx', 'xlsx', 'png', 'jpg'],
            allowNull: false,
        },
    });

    DocumentFiles.associate = models => {
        DocumentFiles.belongsTo(models.Documents, {
            foreignKey: 'document_id',
            targetKey: 'document_id',
        });
    };
    return DocumentFiles;
};
