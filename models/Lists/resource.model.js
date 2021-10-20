module.exports = (sequelize, Sequelize) => {
    const resource = sequelize.define("resources", {
        name: {
            type: Sequelize.STRING
        },
        value: {
            type: Sequelize.STRING
        }

    });

    return resource;
};