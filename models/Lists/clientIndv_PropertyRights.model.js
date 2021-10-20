module.exports = (sequelize, Sequelize) => {
    const clientIndv_PR = sequelize.define("clientIndv_PRs", {
        name: {
            type: Sequelize.STRING
        }

    });

    return clientIndv_PR;
};