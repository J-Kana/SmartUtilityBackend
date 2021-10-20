const db = require("../models/");
const Country = db.country;
const City = db.city;
const Region = db.region;
const MicroRegion = db.microregion;
const Street = db.street;
const House = db.house;
const Apartment = db.apartment;
const ClientIndv = db.clientIndv;
const ClientLegal = db.clientLegal;

const templase = require('../templateResponse')

// exports.allObject = (req, res) => {
//     try {
//         Country.findAll()
//             .then(async objects => {
//                 if (objects.length === 0) {
//                     templase(500, "Не найдено ни одного объекта!", [], true, res)
//                 } else {
//                     let CountryArr = []
//                     for(let country of objects) {
//                         try {
//                             let cities = await City.findAll({where: {countryId: country.dataValues.id}})
//                             for(let city of cities) {
//
//                                 let city_arr = new Map().set(city.dataValues.id, city.dataValues),
//                                     array = Array.from(city_arr, ([name, value]) => ({name, value}));
//                                 console.log(array);
//
//
//                                 /****/
//                                 try {
//                                     let regions = await Region.findAll({where: {cityId: city.dataValues.id}})
//                                     for(let region of regions) {
//                                         // let region_arr = city_arr.map(),
//                                         let region_arr = city_arr.set(region.dataValues.id, region.dataValues),
//                                            array2 = Array.from(region_arr, ([name, value]) => ({name, value}));
//                                         console.log(array2);
//                                     }
//                                 } catch (e) {
//                                     templase(500, e.message, [], true, res)
//                                 }
//                             }
//                             CountryArr.push(country.dataValues)
//                         } catch (e) {
//                             templase(500, e.message, [], true, res)
//                         }
//                     }
//                     templase(200, "", objects, true, res)
//                 }
//             })
//             .catch(err => templase(500, err.message, [], true, res));
//     } catch (e) {
//         templase(500, e.message, [], true, res)
//     }
// };

exports.allObject = (req, res) => {
    try {
        Country.findAll()
            .then(async objects => {
                if (objects.length === 0) {
                    templase(500, "Не найдено ни одного объекта!", [], true, res)
                } else {
                    /****************************************************************************************************************************************************/
                    /*                                                                     COUNTRY                                                                      */
                    /****************************************************************************************************************************************************/
                    let CountryArr = []
                    for (let country of objects) {
                        try {
                            /********************************************************************************************************************************************/
                            /*                                                                  CITY                                                                    */
                            /********************************************************************************************************************************************/
                            let CityArr = []
                            country.dataValues.key = country.dataValues.id + "-country"
                            country.dataValues.title = country.dataValues.name
                            let cities = await City.findAll({where: {countryId: country.dataValues.id}})
                            for (let city of cities) {
                                try {
                                    /************************************************************************************************************************************/
                                    /*                                                                REGION                                                            */
                                    /************************************************************************************************************************************/
                                    let RegionArr = []
                                    city.dataValues.key = city.dataValues.id + "-city"
                                    city.dataValues.title = city.dataValues.name
                                    let regions = await Region.findAll({where: {cityId: city.dataValues.id}})
                                    for (let region of regions) {
                                        try {
                                            /****************************************************************************************************************************/
                                            /*                                                           MICRO-REGION                                                   */
                                            /****************************************************************************************************************************/
                                            let MicroregionArr = []
                                            region.dataValues.key = region.dataValues.id + "-region"
                                            region.dataValues.title = region.dataValues.name
                                            let microregions = await MicroRegion.findAll({where: {regionId: region.dataValues.id}})
                                            for (let microregion of microregions) {
                                                try {
                                                    /********************************************************************************************************************/
                                                    /*                                                          STREET                                                  */
                                                    /********************************************************************************************************************/
                                                    let StreetArr = []
                                                    microregion.dataValues.key = microregion.dataValues.id + "-microregion"
                                                    microregion.dataValues.title = microregion.dataValues.name
                                                    let streets = await Street.findAll({where: {microregionId: microregion.dataValues.id}})
                                                    for (let street of streets) {
                                                        try {
                                                            /************************************************************************************************************/
                                                            /*                                                      HOUSE                                               */
                                                            /************************************************************************************************************/
                                                            let HouseArr = []
                                                            street.dataValues.key = street.dataValues.id + "-street"
                                                            street.dataValues.title = street.dataValues.name
                                                            let houses = await House.findAll({where: {streetId: street.dataValues.id}})
                                                            for (let house of houses) {
                                                                try {
                                                                    /****************************************************************************************************/
                                                                    /*                                                 APARTMENT                                        */
                                                                    /****************************************************************************************************/
                                                                    let ApartmentArr = []
                                                                    house.dataValues.key = house.dataValues.id + "-house"
                                                                    house.dataValues.title = house.dataValues.name
                                                                    let apartments = await Apartment.findAll({where: {houseId: house.dataValues.id}})
                                                                    for (let apartment of apartments) {
                                                                        apartment.dataValues.key = apartment.dataValues.id + "-apartment"
                                                                        apartment.dataValues.title = apartment.dataValues.name
                                                                        ApartmentArr.push(apartment.dataValues)
                                                                    }
                                                                    house.dataValues.children = apartments
                                                                    HouseArr.push(house.dataValues)
                                                                } catch (e) {
                                                                    templase(500, e.message, [], true, res)
                                                                }
                                                            }
                                                            street.dataValues.children = houses
                                                            StreetArr.push(street.dataValues)
                                                        } catch (e) {
                                                            templase(500, e.message, [], true, res)
                                                        }
                                                    }
                                                    microregion.dataValues.children = streets
                                                    MicroregionArr.push(microregion.dataValues)
                                                } catch (e) {
                                                    templase(500, e.message, [], true, res)
                                                }
                                            }
                                            region.dataValues.children = microregions
                                            RegionArr.push(region.dataValues)
                                        } catch (e) {
                                            templase(500, e.message, [], true, res)
                                        }
                                    }
                                    city.dataValues.children = regions
                                    CityArr.push(city.dataValues)
                                } catch (e) {
                                    templase(500, e.message, [], true, res)
                                }
                            }
                            country.dataValues.children = cities
                            CountryArr.push(country.dataValues)
                        } catch (e) {
                            templase(500, e.message, [], true, res)
                        }
                    }
                    templase(200, "", objects, true, res)
                }
            })
            .catch(err => templase(500, err.message, [], true, res));
    } catch (e) {
        templase(500, e.message, [], true, res)
    }
};
exports.chekAddress = (req, res) => {
    let {body} = req
    Apartment.findByPk(body.id).then(async apartments =>{
        try {
            let house = await House.findByPk(apartments.dataValues.houseId)
            let sheet = await Street.findByPk(house.dataValues.streetId)
            let microregion = await MicroRegion.findByPk(sheet.dataValues.microregionId)
            let region = await Region.findByPk(microregion.dataValues.regionId)
            let city = await City.findByPk(region.dataValues.cityId)
            let country = await Country.findByPk(city.dataValues.countryId)
            let clientIndv = await ClientIndv.findOne({where: {apartmentId: apartments.dataValues.id,companyId:body.companyId}})
            let clientLegal =await ClientLegal.findOne({where: {apartmentId: apartments.dataValues.id,companyId:body.companyId}})
            let address = `${country.dataValues.name} г.${city.dataValues.name}, Район ${region.dataValues.name}, Микрорайон ${microregion.dataValues.name}, Улица ${sheet.dataValues.name} д.${house.dataValues.name}, кв.${apartments.dataValues.name} `

            if (clientIndv){
                templase(200, "", {
                    address:address,
                    user:clientIndv,
                    type:'fl'
                }, true, res)
            }else if (clientLegal){
                templase(200, "", {
                    address:address,
                    user:clientLegal,
                    type:'yl'
                }, true, res)
            }else {
                templase(200, "", {
                    address:address,
                    user:null,
                    type:null
                }, true, res)
            }

        }catch (e) {
            templase(500, e.message, [], true, res)

        }

    }).catch(e =>{
        templase(500, e.message, [], true, res)

    })
}
exports.getObject = (req, res) => {
    let {id} = req.params
    try {
        Country.findByPk(id)
            .then(async object => {
                if (!object) {
                    templase(500, "Объект не найден!", [], true, res)
                } // если Объект не найден
                try {
                    let countries = await Country.findByPk(object.dataValues.countryId)
                    object.dataValues.country = countries
                    templase(200, "", object, true, res)
                } catch (e) {
                    templase(500, e.message, [], true, res)

                }
            })
            .catch(err => templase(500, err.message, [], true, res));

    } catch (e) {
        templase(500, e.message, [], true, res)
    }
};

exports.objectCreate = (req, res) => {
    try {
        let {body} = req
        Country.create(body).then(object => {
            if (!object) {
                templase(500, "Объект НЕ был зарегестрирован!", [], true, res)

            }
            templase(200, "Объект был успешно зарегестрирован!", [], true, res)


        }).catch(err => {
            templase(500, err.message, [], true, res)
        });
    } catch (e) {
        templase(500, e.message, [], true, res)

    }
};

exports.objectUpdate = (req, res) => {
    try {
        let {id} = req.params
        let {body} = req
        Country.update(body, {
            where: {
                id: id
            }
        }).then((response) => {
            if (response[0]) {
                templase(200, "Объект был успешно обновлен!", [], true, res)
            } else {
                templase(500, "Объект НЕ найден!", [], true, res)

            }
        }).catch(e => {
            templase(500, e.message, [], true, res)

        });

    } catch (e) {
        templase(500, e.message, [], true, res)
    }
};

exports.objectDelete = (req, res) => {
    try {
        let {id} = req.params
        Country.destroy({
            where: {
                id: id
            }
        }).then((response) => {
            if (response === 1) {
                templase(200, "Объект был успешно удален!", [], true, res)
            } else {
                templase(500, "Объект не найден!", [], true, res)
            }
        }).catch(e => {
            templase(500, e.message, [], true, res)

        });
    } catch (e) {
        templase(500, e.message, [], true, res)
    }
};
