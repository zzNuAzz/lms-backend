module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define('Users', {
        user_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        role: {
            type: Sequelize.ENUM,
            values: ['Teacher', 'Student'],
            allowNull: false,
            defaultValue: 'Student',
        },

        first_name: {
            type: Sequelize.STRING,
        },

        last_name: {
            type: Sequelize.STRING,
        },

        phone: {
            type: Sequelize.STRING,
        },

        address: {
            type: Sequelize.STRING,
        },

        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: {
                    msg: 'Email is invalid.',
                },
            },
        },
        birthday: {
            type: Sequelize.STRING,
        },
        picture_url: {
            type: Sequelize.STRING,
            defaultValue: '/file/0.jpg',
            allowNull: false,
        },
    });

    Users.associate = models => {
        Users.hasMany(models.CourseMembers, {
            foreignKey: 'user_id',
            sourceKey: 'user_id',
        });
        Users.hasMany(models.ForumThreads, {
            foreignKey: 'author_id',
            sourceKey: 'user_id',
        });
        Users.hasMany(models.ThreadPosts, {
            foreignKey: 'author_id',
            sourceKey: 'user_id',
        });
    };
    return Users;
};
