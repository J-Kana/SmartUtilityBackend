module.exports = (sequelize, Sequelize) => {
    const city = sequelize.define("cities", {
        name: {
            type: Sequelize.STRING
        },
        group: {
            type: Sequelize.STRING
        },

    });

    return city;
};