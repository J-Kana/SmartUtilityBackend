module.exports = (sequelize, Sequelize) => {
    const street = sequelize.define("streets", {
        name: {
            type: Sequelize.STRING
        },
        group: {
            type: Sequelize.STRING
        },

    });

    return street;
};