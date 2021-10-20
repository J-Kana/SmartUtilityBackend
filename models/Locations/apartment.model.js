module.exports = (sequelize, Sequelize) => {
    const apartment = sequelize.define("apartments", {
        name: {
            type: Sequelize.STRING
        },
        group: {
            type: Sequelize.STRING
        },


    });

    return apartment;
};