module.exports = (sequelize, Sequelize) => {
    const country = sequelize.define("countries", {
        name: {
            type: Sequelize.STRING
        },
        group: {
            type: Sequelize.STRING
        },


    });

    return country;
};