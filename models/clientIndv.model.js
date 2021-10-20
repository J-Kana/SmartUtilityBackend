module.exports = (sequelize, Sequelize) => {
    const ClientIndv = sequelize.define("clientIndvs", {
        personal_acc: {
            type: Sequelize.STRING
        },
        IIN: {
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
        Indv_type: {
            type: Sequelize.STRING
        }


    });

    return ClientIndv;
};