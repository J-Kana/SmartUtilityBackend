const Op = require("sequelize").Op;
const db = require("../models");
const clientIndv = db.clientIndv;
const clientLegal = db.clientLegal;
const device1 = db.device1;
const device2 = db.device2;
const resource = db.resource;
const apartment = db.apartment;
const house = db.house;
const street = db.street;
const microregion = db.microregion;
const region = db.region;
const city = db.city;
const country = db.country;
const templase = require("../templateResponse")

/***************************************************/
/*                  Вся Статистика                 */
/***************************************************/
exports.getStatics = (req, res) => {
    try {
        let {start_dt, end_dt, client_type, company_id, aparts} = req.body
        /************************************************************************************************************************************************************/
        /*                                                                      Физическое Лицо                                                                     */
        /************************************************************************************************************************************************************/
        if(client_type === "fl") {
            /****************       Ищем клиента по id квартиры и компании      *************************/
            clientIndv.findAll({where: {apartmentId: {[Op.and]: [aparts]}, companyId: company_id}})
                .then(async objects => {
                    let IndividualArr = []
                    let IndvObj = {}
                    /*****  Проверяет каждого клиента  *****/
                    for(let object of objects) {
                        try {
                            /*************       Ищем устройство 1 по id клиента      *************/
                            let dev1s = await device1.findAll({where: {clientIndvId: object.dataValues.id}})
                            for(let dev1 of dev1s){
                                /*************       Ищем устройство 2 по id устройство 1      *************/
                                let dev2s = await device2.findAll({where: {sn: dev1.dataValues.device1_num, ms: {[Op.between]: [start_dt, end_dt]}}})
                                for(let dev2 of dev2s) {
                                    /*********  Парсим данные из устройства 2   *********/
                                    let dev2_data = JSON.parse(dev2.dataValues.data)
                                    if(dev2_data && dev2_data.length > 0) {
                                        let data_obj = dev2_data[dev2_data.length - 1]
                                        dev2.dataValues.dateMessages = data_obj.ts          /*********  Данные о дате и времени   *********/
                                        if (data_obj.inp && data_obj.inp.length > 0) {
                                            let inp_obj = data_obj.inp[0]
                                            dev2.dataValues.value = inp_obj.v[0]            /*********  Данные о расходе устройства   *********/
                                        }
                                    }
                                    /*************       Ищем данные о типе ресурса      *************/
                                    let Resource = await resource.findOne({where: {id: dev1.dataValues.resourceId}})
                                    /***************************       Ищем данные об адресе клиента      ***************************/
                                    let aparts = await apartment.findOne({where: {id: object.dataValues.apartmentId}})
                                    if(aparts) {
                                        let Apart = aparts.dataValues.name
                                        let houses = await house.findOne({where: {id: aparts.dataValues.houseId}})
                                        if(houses) {
                                            let House = houses.dataValues.name + ", кв." + Apart
                                            let streets = await street.findOne({where: {id: houses.dataValues.streetId}})
                                            if(streets) {
                                                let Street = streets.dataValues.name + ", д." + House
                                                let microregions = await microregion.findOne({where: {id: streets.dataValues.microregionId}})
                                                if(microregions) {
                                                    let Microregion = microregions.dataValues.name + ", Улица " + Street
                                                    let regions = await region.findOne({where: {id: microregions.dataValues.regionId}})
                                                    if(regions) {
                                                        let Region = regions.dataValues.name + ", Микрорайон " + Microregion
                                                        let cities = await city.findOne({where: {id: regions.dataValues.cityId}})
                                                        if(cities) {
                                                            let City = cities.dataValues.name + ", Район " + Region
                                                            let countries = await country.findOne({where: {id: cities.dataValues.countryId}})
                                                            if(countries) {
                                                                let Country = countries.dataValues.name + ", г." + City
                                                                IndvObj.address = Country                                  /*********  Данные о локации   *********/
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    /*********  Отображаем вышеперечисленные данные   *********/
                                    IndvObj.dateMessages = dev2.dataValues.dateMessages
                                    IndvObj.value = dev2.dataValues.value
                                    IndvObj.sn = dev2.dataValues.sn
                                    IndvObj.client = object.dataValues
                                    IndvObj.resource = Resource
                                    IndividualArr.push({...IndvObj})
                                }
                            }
                        } catch (e) {
                            templase(500, e.message, [], true, res)
                        }
                    }
                    templase(200, "", IndividualArr, true, res)
                })
                .catch(err => templase(500, err.message, [], true, res));
        }
        /************************************************************************************************************************************************************/
        /*                                                                      Юридическое Лицо                                                                    */
        /************************************************************************************************************************************************************/
        if(client_type === "yl") {
            /****************       Ищем клиента по id квартиры и компании      *************************/
            clientLegal.findAll({where: {apartmentId: {[Op.and]: [aparts]}, companyId: company_id}})
                .then(async objects => {
                    let LegalArr = []
                    let LegalObj = {}
                    /*****  Проверяет каждого клиента  *****/
                    for(let object of objects) {
                        try {
                            /*************       Ищем устройство 1 по id клиента      *************/
                            let dev1s = await device1.findAll({where: {clientLegalId: object.dataValues.id}})
                            for(let dev1 of dev1s){
                                /*************       Ищем устройство 2 по id устройство 1      *************/
                                let dev2s = await device2.findAll({where: {sn: dev1.dataValues.device1_num, ms: {[Op.between]: [start_dt, end_dt]}}})
                                for(let dev2 of dev2s) {
                                    /*********  Парсим данные из устройства 2   *********/
                                    let dev2_data = JSON.parse(dev2.dataValues.data)
                                    if(dev2_data && dev2_data.length > 0) {
                                        let data_obj = dev2_data[dev2_data.length - 1]
                                        dev2.dataValues.dateMessages = data_obj.ts          /*********  Данные о дате и времени   *********/
                                        if (data_obj.inp && data_obj.inp.length > 0) {
                                            let inp_obj = data_obj.inp[0]
                                            dev2.dataValues.value = inp_obj.v[0]            /*********  Данные о расходе устройства   *********/
                                        }
                                    }
                                    /*************       Ищем данные о типе ресурса      *************/
                                    let Resource = await resource.findOne({where: {id: dev1.dataValues.resourceId}})
                                    /***************************       Ищем данные об адресе клиента      ***************************/
                                    let aparts = await apartment.findOne({where: {id: object.dataValues.apartmentId}})
                                    if(aparts) {
                                        let Apart = aparts.dataValues.name
                                        let houses = await house.findOne({where: {id: aparts.dataValues.houseId}})
                                        if(houses) {
                                            let House = houses.dataValues.name + ", кв." + Apart
                                            let streets = await street.findOne({where: {id: houses.dataValues.streetId}})
                                            if(streets) {
                                                let Street = streets.dataValues.name + ", д." + House
                                                let microregions = await microregion.findOne({where: {id: streets.dataValues.microregionId}})
                                                if(microregions) {
                                                    let Microregion = microregions.dataValues.name + ", Улица " + Street
                                                    let regions = await region.findOne({where: {id: microregions.dataValues.regionId}})
                                                    if(regions) {
                                                        let Region = regions.dataValues.name + ", Микрорайон " + Microregion
                                                        let cities = await city.findOne({where: {id: regions.dataValues.cityId}})
                                                        if(cities) {
                                                            let City = cities.dataValues.name + ", Район " + Region
                                                            let countries = await country.findOne({where: {id: cities.dataValues.countryId}})
                                                            if(countries) {
                                                                let Country = countries.dataValues.name + ", г." + City
                                                                LegalObj.address = Country                                  /*********  Данные о локации   *********/
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    /*********  Отображаем вышеперечисленные данные   *********/
                                    LegalObj.dateMessages = dev2.dataValues.dateMessages
                                    LegalObj.value = dev2.dataValues.value
                                    LegalObj.sn = dev2.dataValues.sn
                                    LegalObj.client = object.dataValues
                                    LegalObj.resource = Resource
                                    LegalArr.push({...LegalObj})
                                }
                            }
                        } catch (e) {
                            templase(500, e.message, [], true, res)
                        }
                    }
                    templase(200, "", LegalArr, true, res)
                })
                .catch(err => templase(500, err.message, [], true, res));
        }
    } catch (e) {
        templase(500, e.message, [], true, res)
    }
};

/***************************************************/
/*          Статистика по одному клиенту           */
/***************************************************/
exports.getOneStatic = (req, res) => {
    try {
        let {start_dt, end_dt, client_type, company_id, aparts} = req.body
        /************************************************************************************************************************************************************/
        /*                                                                      Физическое Лицо                                                                     */
        /************************************************************************************************************************************************************/
        if(client_type === "fl") {
            /****************       Ищем клиента по id квартиры и компании      *************************/
            clientIndv.findOne({where: {apartmentId: aparts, companyId: company_id}})
                .then(async object => {
                    let IndividualArr = []
                    let IndvObj = {}
                    /*****  Проверяет каждого клиента  *****/
                    if(object) {
                        try {
                            /*************       Ищем устройство 1 по id клиента      *************/
                            let dev1s = await device1.findAll({where: {clientIndvId: object.dataValues.id}})
                            for(let dev1 of dev1s){
                                /*************       Ищем устройство 2 по id устройство 1      *************/
                                let dev2s = await device2.findAll({where: {sn: dev1.dataValues.device1_num, ms: {[Op.between]: [start_dt, end_dt]}}})
                                for(let dev2 of dev2s) {
                                    /*********  Парсим данные из устройства 2   *********/
                                    let dev2_data = JSON.parse(dev2.dataValues.data)
                                    if(dev2_data && dev2_data.length > 0) {
                                        let data_obj = dev2_data[dev2_data.length - 1]
                                        dev2.dataValues.dateMessages = data_obj.ts          /*********  Данные о дате и времени   *********/
                                        if (data_obj.inp && data_obj.inp.length > 0) {
                                            let inp_obj = data_obj.inp[0]
                                            dev2.dataValues.value = inp_obj.v[0]            /*********  Данные о расходе устройства   *********/
                                        }
                                    }
                                    /*************       Ищем данные о типе ресурса      *************/
                                    let Resource = await resource.findOne({where: {id: dev1.dataValues.resourceId}})
                                    /***************************       Ищем данные об адресе клиента      ***************************/
                                    let aparts = await apartment.findOne({where: {id: object.dataValues.apartmentId}})
                                    if(aparts) {
                                        let Apart = aparts.dataValues.name
                                        let houses = await house.findOne({where: {id: aparts.dataValues.houseId}})
                                        if(houses) {
                                            let House = houses.dataValues.name + ", кв." + Apart
                                            let streets = await street.findOne({where: {id: houses.dataValues.streetId}})
                                            if(streets) {
                                                let Street = streets.dataValues.name + ", д." + House
                                                let microregions = await microregion.findOne({where: {id: streets.dataValues.microregionId}})
                                                if(microregions) {
                                                    let Microregion = microregions.dataValues.name + ", Улица " + Street
                                                    let regions = await region.findOne({where: {id: microregions.dataValues.regionId}})
                                                    if(regions) {
                                                        let Region = regions.dataValues.name + ", Микрорайон " + Microregion
                                                        let cities = await city.findOne({where: {id: regions.dataValues.cityId}})
                                                        if(cities) {
                                                            let City = cities.dataValues.name + ", Район " + Region
                                                            let countries = await country.findOne({where: {id: cities.dataValues.countryId}})
                                                            if(countries) {
                                                                let Country = countries.dataValues.name + ", г." + City
                                                                IndvObj.address = Country                                  /*********  Данные о локации   *********/
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    /*********  Отображаем вышеперечисленные данные   *********/
                                    IndvObj.dateMessages = dev2.dataValues.dateMessages
                                    IndvObj.value = dev2.dataValues.value
                                    IndvObj.sn = dev2.dataValues.sn
                                    IndvObj.client = object.dataValues
                                    IndvObj.resource = Resource
                                }
                                IndividualArr.push({...IndvObj})
                            }
                        } catch (e) {
                            templase(500, e.message, [], true, res)
                        }
                    }
                    templase(200, "", IndividualArr, true, res)
                })
                .catch(err => templase(500, err.message, [], true, res));
        }
        /************************************************************************************************************************************************************/
        /*                                                                      Юридическое Лицо                                                                    */
        /************************************************************************************************************************************************************/
        if(client_type === "yl") {
            /****************       Ищем клиента по id квартиры и компании      *************************/
            clientLegal.findOne({where: {apartmentId: aparts, companyId: company_id}})
                .then(async object => {
                    let LegalArr = []
                    let LegalObj = {}
                    /*****  Проверяет каждого клиента  *****/
                    if(object) {
                        try {
                            /*************       Ищем устройство 1 по id клиента      *************/
                            let dev1s = await device1.findAll({where: {clientLegalId: object.dataValues.id}})
                            for(let dev1 of dev1s) {
                                /*************       Ищем устройство 2 по id устройство 1      *************/
                                let dev2s = await device2.findAll({where: {sn: dev1.dataValues.device1_num, ms: {[Op.between]: [start_dt, end_dt]}}})
                                for (let dev2 of dev2s) {
                                    /*********  Парсим данные из устройства 2   *********/
                                    let dev2_data = JSON.parse(dev2.dataValues.data)
                                    if (dev2_data && dev2_data.length > 0) {
                                        let data_obj = dev2_data[dev2_data.length - 1]
                                        dev2.dataValues.dateMessages = data_obj.ts          /*********  Данные о дате и времени   *********/
                                        if (data_obj.inp && data_obj.inp.length > 0) {
                                            let inp_obj = data_obj.inp[0]
                                            dev2.dataValues.value = inp_obj.v[0]            /*********  Данные о расходе устройства   *********/
                                        }
                                    }

                                    /*************       Ищем данные о типе ресурса      *************/
                                    let Resource = await resource.findOne({where: {id: dev1.dataValues.resourceId}})
                                    /***************************       Ищем данные об адресе клиента      ***************************/
                                    let aparts = await apartment.findOne({where: {id: object.dataValues.apartmentId}})
                                    if (aparts) {
                                        let Apart = aparts.dataValues.name
                                        let houses = await house.findOne({where: {id: aparts.dataValues.houseId}})
                                        if (houses) {
                                            let House = houses.dataValues.name + ", кв." + Apart
                                            let streets = await street.findOne({where: {id: houses.dataValues.streetId}})
                                            if (streets) {
                                                let Street = streets.dataValues.name + ", д." + House
                                                let microregions = await microregion.findOne({where: {id: streets.dataValues.microregionId}})
                                                if (microregions) {
                                                    let Microregion = microregions.dataValues.name + ", Улица " + Street
                                                    let regions = await region.findOne({where: {id: microregions.dataValues.regionId}})
                                                    if (regions) {
                                                        let Region = regions.dataValues.name + ", Микрорайон " + Microregion
                                                        let cities = await city.findOne({where: {id: regions.dataValues.cityId}})
                                                        if (cities) {
                                                            let City = cities.dataValues.name + ", Район " + Region
                                                            let countries = await country.findOne({where: {id: cities.dataValues.countryId}})
                                                            if (countries) {
                                                                let Country = countries.dataValues.name + ", г." + City
                                                                LegalObj.address = Country                                  /*********  Данные о локации   *********/
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    /*********  Отображаем вышеперечисленные данные   *********/
                                    LegalObj.dateMessages = dev2.dataValues.dateMessages
                                    LegalObj.value = dev2.dataValues.value
                                    LegalObj.sn = dev2.dataValues.sn
                                    LegalObj.client = object.dataValues
                                    LegalObj.resource = Resource
                                    LegalArr.push({...LegalObj})
                                }
                            }
                        } catch (e) {
                            templase(500, e.message, [], true, res)
                        }
                    }
                    // LegalArr.push(LegalObj)
                    templase(200, "", LegalArr, true, res)
                })
                .catch(err => templase(500, err.message, [], true, res));
        }
    } catch (e) {
        templase(500, e.message, [], true, res)
    }
};