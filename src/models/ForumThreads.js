module.exports = (sequelize, Sequelize) => {
    const ForumThreads = sequelize.define('ForumThreads', {
        forum_thread_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        course_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        author_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

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
    });

    ForumThreads.associate = models => {
        ForumThreads.belongsTo(models.Users, {
            foreignKey: 'author_id',
            targetKey: 'user_id',
            as: 'author',
        });
        ForumThreads.belongsTo(models.Courses, {
            foreignKey: 'course_id',
            targetKey: 'course_id',
            as: 'course',
        });
        ForumThreads.hasMany(models.ThreadPosts, {
            foreignKey: 'forum_thread_id',
            sourceKey: 'forum_thread_id',
        });
    };
    return ForumThreads;
};
