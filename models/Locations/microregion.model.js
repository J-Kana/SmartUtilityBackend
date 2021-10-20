module.exports = (sequelize, Sequelize) => {
    const microregion = sequelize.define("microregions", {
        name: {
            type: Sequelize.STRING
        },
        group: {
            type: Sequelize.STRING
        },

    });

    return microregion;
};