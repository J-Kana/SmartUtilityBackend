module.exports = (sequelize, Sequelize) => {
    const clientLegal_Type = sequelize.define("clientLegal_Type", {
        name: {
            type: Sequelize.STRING
        }

    });

    return clientLegal_Type;
};