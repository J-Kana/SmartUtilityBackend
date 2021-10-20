module.exports = (sequelize, Sequelize) => {
    const Company = sequelize.define("companies", {
        company_name: {
            type: Sequelize.STRING
        },
        BIN: {
            type: Sequelize.STRING
        },
        surname: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        },
        patronymic: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        resources: {
            type: Sequelize.STRING
        },

    });

    return Company;
};