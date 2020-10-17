module.exports = (sequelize, Sequelize) => {
    const ThreadPosts = sequelize.define('ThreadPosts', {
        thread_post_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        forum_thread_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        author_id: {
            type: Sequelize.INTEGER,
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
    });

    ThreadPosts.associate = models => {
        ThreadPosts.belongsTo(models.ForumThreads, {
            foreignKey: 'forum_thread_id',
            targetKey: 'forum_thread_id',
        });
    };
    return ThreadPosts;
};
