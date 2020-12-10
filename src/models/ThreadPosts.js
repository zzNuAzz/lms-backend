module.exports = (sequelize, Sequelize) => {
    const ThreadPosts = sequelize.define('ThreadPosts', {
        post_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        thread_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        author_id: {
            type: Sequelize.INTEGER,
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

    ThreadPosts.associate = models => {
        ThreadPosts.belongsTo(models.ForumThreads, {
            foreignKey: 'thread_id',
            targetKey: 'thread_id',
            as: 'thread'
        });
        ThreadPosts.belongsTo(models.Users, {
            foreignKey: 'author_id',
            targetKey: 'user_id',
            as:'author'
        })
    };
    return ThreadPosts;
};
