module.exports = (sequelize, Sequelize) => {
    const house = sequelize.define("houses", {
        name: {
            type: Sequelize.STRING
        },
        group: {
            type: Sequelize.STRING
        },

    });

    return house;
};