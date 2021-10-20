module.exports = (sequelize, Sequelize) => {
    const Device2 = sequelize.define("device2", {
        sn: {
            type: Sequelize.STRING      // Серийный номер контроллера
        },
        ip: {
            type: Sequelize.STRING      // Внуттренний ip, с которого выходил на связь
        },
        net: {
            type: Sequelize.STRING      // сеть
        },
        rssi: {
            type: Sequelize.INTEGER     // мощность радио сигнала для текущего соединения, dB
        },
        hw: {
            type: Sequelize.STRING      // версия оборудования
        },
        fw: {
            type: Sequelize.STRING      // версия прошивки
        },
        bat: {
            type: Sequelize.INTEGER     // уровень батареи в процентах ПЕРЕД выключением
        },
        LOG: {
            type: Sequelize.INTEGER     // параметр УСПД - интервал журналирования, секунд
        },
        SEND: {
            type: Sequelize.INTEGER     // параметр УСПД - интервал отправки данных на сервер, секунд
        },
        SCAN: {
            type: Sequelize.INTEGER     // параметр УСПД - интервал опроса датчиков, секунд
        },
        VOL: {
            type: Sequelize.INTEGER     // параметр УСПД - отправка данных на сервер по объему, литров
        },
        ms: {
            type: Sequelize.INTEGER
        },
        data: {
            type: Sequelize.TEXT        // массив записей журнала идентифицируемых по времени ts и номеру записи id
        }

    });

    return Device2;
};