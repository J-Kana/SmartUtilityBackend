const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        operatorsAliases: false,

        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.company = require("../models/company.model.js")(sequelize, Sequelize);
db.device1 = require("../models/device1.model.js")(sequelize, Sequelize);
db.device2 = require("../models/device2.model.js")(sequelize, Sequelize);
db.clientIndv = require("../models/clientIndv.model.js")(sequelize, Sequelize);
db.clientLegal = require("../models/clientLegal.model.js")(sequelize, Sequelize);

/******************************      LOCATIONS       ***************************************/
db.country = require("../models/Locations/country.model.js")(sequelize, Sequelize);
db.city = require("../models/Locations/city.model.js")(sequelize, Sequelize);
db.region = require("../models/Locations/region.model.js")(sequelize, Sequelize);
db.microregion = require("../models/Locations/microregion.model.js")(sequelize, Sequelize);
db.street = require("../models/Locations/street.model.js")(sequelize, Sequelize);
db.house = require("../models/Locations/house.model.js")(sequelize, Sequelize);
db.apartment = require("../models/Locations/apartment.model.js")(sequelize, Sequelize);
/*******************************************************************************************/

/***********************************      LISTS       **************************************/
db.role = require("../models/Lists/role.model.js")(sequelize, Sequelize);
db.resource = require("../models/Lists/resource.model.js")(sequelize, Sequelize);
db.notification = require("../models/Lists/notification.model.js")(sequelize, Sequelize);
db.clientLT = require("../models/Lists/clientLegal_Type.model.js")(sequelize, Sequelize);
db.clientPR = require("../models/Lists/clientIndv_PropertyRights.model.js")(sequelize, Sequelize);
/*******************************************************************************************/

/************************************************************************************************************************************/
/*                                                       ASSOCIATIONS                                                               */
/************************************************************************************************************************************/
/************** Users ****************/
db.role.hasMany(db.user);
db.company.hasMany(db.user);
/*************************************/

/************** Company **************/
db.city.hasMany(db.company);
/*************************************/

/*************** Devise1 *************/
db.clientLegal.hasMany(db.device1)
db.clientIndv.hasMany(db.device1)
db.company.hasMany(db.device1)
db.resource.hasMany(db.device1)
/*************************************/

/*************** Client **************/
db.company.hasMany(db.clientIndv)
db.company.hasMany(db.clientLegal)
db.apartment.hasMany(db.clientIndv)
db.apartment.hasMany(db.clientLegal)
db.clientPR.hasMany(db.clientIndv)
db.clientLT.hasMany(db.clientLegal)
/*************************************/

/************** Locations ************/
db.country.hasMany(db.city)
db.city.hasMany(db.region)
db.region.hasMany(db.microregion)
db.microregion.hasMany(db.street)
db.street.hasMany(db.house)
db.house.hasMany(db.apartment)
/*************************************/
/************************************************************************************************************************************/
/*                                                       END OF ASSOCIATIONS                                                        */
/************************************************************************************************************************************/

module.exports = db;
