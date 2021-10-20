module.exports = (sequelize, Sequelize) => {
    const Device1 = sequelize.define("device1", {
        device1_num: {
            type: Sequelize.STRING
        },
        dev_type: {
            type: Sequelize.STRING
        },
        resource_type: {
            type: Sequelize.STRING
        },
        dev_name: {
            type: Sequelize.STRING
        },
        HW_version: {
            type: Sequelize.STRING
        },
        SW_version: {
            type: Sequelize.STRING
        },
        product_date: {
            type: Sequelize.STRING
        },
        start_date: {
            type: Sequelize.STRING
        },
        start_value: {
            type: Sequelize.STRING
        },
        detector_type: {
            type: Sequelize.STRING
        }

    });

    return Device1;
};