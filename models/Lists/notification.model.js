module.exports = (sequelize, Sequelize) => {
    const notification = sequelize.define("notifications", {
        name: {
            type: Sequelize.STRING
        },
        value: {
            type: Sequelize.STRING
        }

    });

    return notification;
};