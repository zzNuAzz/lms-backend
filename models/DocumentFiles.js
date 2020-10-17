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
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        url: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        format: {
            type: Sequelize.ENUM,
            values: ['pdf', 'doc', 'docx', 'xlsx', 'png', 'jpg'],
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
