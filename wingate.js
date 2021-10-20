require('custom-env').env()
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require('path')
const multer = require('multer')
const bcrypt = require("bcryptjs");

const app = express();
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname + '/uploads/'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
let upload = multer({ storage: storage })
app.use(upload.single('logo'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'upload')))
app.use(cors( ''))
/***********************************************************************************************/
/*                                      CONSTANTS                                              */
/***********************************************************************************************/
const db = require("./models");
const Role = db.role;
const Notif = db.notification;
const Resource = db.resource
const User = db.user
const Company = db.company
const Country = db.country
const City = db.city
const Region = db.region
const Microregion = db.microregion
const Street = db.street
const House = db.house
const Apartment = db.apartment
const ClientLegal = db.clientLegal
const ClientIndv = db.clientIndv
const ClientPR = db.clientPR;
const ClientLT = db.clientLT;

/***********************************************************************************************/
/*                                      DATABASE                                               */
/***********************************************************************************************/
db.sequelize.sync();
// db.sequelize.sync({force: true}).then(() => {
//    console.log('Drop and Resync Db');
//    initial();
// });
/***********************************************************************************************/
/*                                  CREATE FUNCTION                                            */
/***********************************************************************************************/
function initial() {
    /************************   ROLES   **************************/
    Role.create({
        id:1,
        name: "Сотрудник",
        value: "user"
    });
    Role.create({
        id:2,
        name: "Супер Админ",
        value: "superadmin"
    });
    Role.create({
        id:3,
        name: "Админ",
        value: "admin"
    });
    /**************************************************************/
    /********************   NOTIFICATIONS   ***********************/
    Notif.create({
        name: "SMS",
        value: "sms"
    });
    Notif.create({
        name: "EMAIL",
        value: "email"
    });
    Notif.create({
        name: "PUSH",
        value: "push"
    });
    /**************************************************************/
    /**********************   RESOURCES   *************************/
    Resource.create({
        name: "Газ",
        value: "Gas"
    });
    Resource.create({
        name: "Горячая вода",
        value: "HotWater"
    });
    Resource.create({
        name: "Холодная вода",
        value: "ColdWater"
    });
    Resource.create({
        name: "Электроэнергия",
        value: "ElectricPower"
    });
    Resource.create({
        name: "Тепло",
        value: "Heat"
    });
    /**************************************************************/
    /**********************   LOCATIONS   *************************/
    Country.create({
        name:"Казахстан",
        group:"country"
    })
    City.create({
        name:'Нур-Султан (Астана)',
        group:"city",
        // countryId:0
    })
    Region.create({
        name:"Есильский район",
        group:"region",
        // cityId:0
    })
    Microregion.create({
        name:"Чубары",
        group:"microregion",
        // regionId:0
    })
    Street.create({
        name:"Арай, 35/1",
        group:"street",
        // microregionId:0
    })
    House.create({
        name:"35/1",
        group:"house",
        // streetId:0
    })
    Apartment.create({
        name:"1",
        group:"apartment",
        // houseId:0
    })
    Apartment.create({
        name:"22",
        group:"apartment",
        // houseId:0
    })
    /**************************************************************/
    /***********************   COMPANY   **************************/
    Company.create({
        company_name:"TOO Winext",
        BIN:"4447758555",
        name:"Winext",
        surname:"System",
        patronymic:"",
        phone:"+7(777)-777-77-77",
        email:"info@winext.kz",
        // cityId:0,
        resources:'1,2,3,4,5'
    })
    /**************************************************************/
    /************************   USER   ****************************/
    User.create({
        name:"Winext",
        surname:"System",
        patronymic:"",
        phone:"+7(777)-70=77-77-77",
        login:"winext",
        email:"info@winext.kz",
        notifications:"1,2,3",
        password:bcrypt.hashSync("qwer1212", 8),
        roleId:2,
        // companyId:0
    })
    /**************************************************************/
    /***********************   CLIENT   ***************************/
    ClientIndv.create({
        personal_acc:"455454454545",
        IIN:"454544545544154",
        name:"Ива́н",
        surname:"Ива́нович",
        patronymic:"Дмитриев",
        phone:"+7(777)-70=77-77-77",
        email:"info@winext.kz",
        // clientIndvPRId:0,
        // companyId:0,
        // apartmentId:0
    })
    ClientLegal.create({
        contract_num:"455454454545",
        BIN:"454544545544154",
        legal_name:"Too Winext",
        name:"Ива́н",
        surname:"Ива́нович",
        patronymic:"Дмитриев",
        phone:"+7(777)-70=77-77-77",
        email:"info@winext.kz",
        // clientIndvPRId:0,
        // companyId:0,
        // apartmentId:1
    })
    /**************************************************************/
    /*************   CLIENT PROPERTY RIGHTS   *********************/
    ClientPR.create({
        name: "Индивидуальная"
    })
    ClientPR.create({
        name: "Коллективная"
    })
    ClientPR.create({
        name: "Государственная"
    })
    /**************************************************************/
    /****************   CLIENT LEGAL TYPES   **********************/
    ClientLT.create({
        name: "ИП"      // Индивидуальный Предприниматель
    })
    ClientLT.create({
        name: "ТОО"     // Товарищество с Ограниченной Ответственностью
    })
    ClientLT.create({
        name: "АО"      // Акционерное Общество
    })
    ClientLT.create({
        name: "ООО"     // Общество с Ограниченной Ответственностью
    })
    ClientLT.create({
        name: "ПАО"     // Публичное Акционерное Общество
    })
    ClientLT.create({
        name: "ГП"      // Государственное Предприятие
    })
    ClientLT.create({
        name: "ПК"      // Производственный Кооператив
    })
}
/***********************************************************************************************/
/*                                  ASSIGNING ROUTES                                           */
/***********************************************************************************************/
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/company.routes')(app);
require('./routes/device1.routes')(app);
require('./routes/device2.routes')(app);
require('./routes/clientIndv.routes')(app);
require('./routes/clientLegal.routes')(app);
require('./routes/locations.routes')(app);
require('./routes/statistics.routes')(app);

/*********************      LISTS       ******************/
require('./routes/role.routes')(app);
require('./routes/resource.routes')(app);
require('./routes/notification.routes')(app);
require('./routes/clientLegal_Type.routes')(app);
require('./routes/clientIndv_PropertyRights.routes')(app);
/*********************************************************/

/******************      LOCATIONS       *****************/
require('./routes/country.routes')(app);
require('./routes/city.routes')(app);
require('./routes/region.routes')(app);
require('./routes/microregion.routes')(app);
require('./routes/street.routes')(app);
require('./routes/house.routes')(app);
require('./routes/apartment.routes')(app);
/*********************************************************/

app.use((req, res) => {
    return res.status(404).send({ message: 'Route' + req.url + ' Not found.' })
})
// 500 - Any server error
app.use((req, res) => {
    return res.status(404).send({ message: 'Route' + req.url + ' Not found.' })
})
app.listen( '3002', () => {
    console.log('Server start')
})
