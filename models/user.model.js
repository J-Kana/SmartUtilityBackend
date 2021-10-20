module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        name: {
            type: Sequelize.STRING
        },
        surname: {
            type: Sequelize.STRING
        },
        patronymic: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        login: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        notifications: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },

    });

    return User;
};
