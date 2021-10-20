module.exports = (sequelize, Sequelize) => {
    const ClientLegal = sequelize.define("clientLegals", {
        contract_num: {
            type: Sequelize.STRING
        },
        BIN: {
            type: Sequelize.STRING
        },
        legal_name: {
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
        }

    });

    return ClientLegal;
};