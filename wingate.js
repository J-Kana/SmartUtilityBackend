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
