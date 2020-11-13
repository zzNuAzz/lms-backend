module.exports = (sequelize, Sequelize) => {
  const AssignmentFiles = sequelize.define('AssignmentFiles', {
      assignment_file_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
      },

      assignment_id: {
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
          // values: [],
          allowNull: false,
      },
  });

  AssignmentFiles.associate = models => {
    AssignmentFiles.belongsTo(models.Assignments, {
          foreignKey: 'assignment_id',
          targetKey: 'assignment_id',
      });
  };
  return AssignmentFiles;
};
