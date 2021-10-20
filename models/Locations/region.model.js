module.exports = (sequelize, Sequelize) => {
    const region = sequelize.define("regions", {
        name: {
            type: Sequelize.STRING
        },
        group: {
            type: Sequelize.STRING
        },


    });

    return region;
};