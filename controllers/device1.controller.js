const db = require("../models");
const device1 = db.device1;
const device2 = db.device2;
const clientLegal = db.clientLegal;
const clientIndv = db.clientIndv;
const company = db.company;
const resource = db.resource;
const country = db.country;
const city = db.city;
const region = db.region;
const microregion = db.microregion;
const street = db.street;
const house = db.house;
const apartment = db.apartment;
const templase = require('../templateResponse')
exports.allObject = (req, res) => {
    try {
        device1.findAll()
            .then(async objects => {
                if (objects.length === 0) {
                    templase(500, "Не найдено ни одного объекта!", [], true, res)
                } else {
                    let device1Arr = []
                    for(let device1 of objects) {
                        try {
                            let companies = await company.findByPk(device1.dataValues.companyId)
                            let clientLegals = await clientLegal.findByPk(device1.dataValues.clientLegalId)
                            let clientIndvs = await clientIndv.findByPk(device1.dataValues.clientIndvId)
                            let resources = await resource.findByPk(device1.dataValues.resourceId)
                            let obj = device1.dataValues

                            obj.company = companies
                            obj.clientLegal = clientLegals
                            obj.clientIndv = clientIndvs
                            obj.resource = resources

                            let client1 = await clientIndv.findOne({where: {id: device1.dataValues.clientIndvId}, order: [['createdAt', 'DESC']]})
                            if(client1) {
                                obj.personal_acc = client1.personal_acc
                                let aparts = await apartment.findOne({where: {id: client1.dataValues.apartmentId}})
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
                                                            obj.address = Country
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            let client2 = await clientLegal.findOne({where: {id: device1.dataValues.clientLegalId}, order: [['createdAt', 'DESC']]})
                            if(client2) {
                                obj.personal_acc = client2.contract_num
                                let aparts = await apartment.findOne({where: {id: client2.dataValues.apartmentId}})
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
                                                            obj.address = Country
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            let devices = await device2.findOne({where: {sn: obj.device1_num, }, order: [['createdAt', 'DESC']]})
                            if(devices) {
                                let device2_data = JSON.parse(devices.dataValues.data)
                                if(device2_data && device2_data.length > 0){
                                    let data_obj = device2_data[device2_data.length - 1]
                                    obj.dateMessages = data_obj.ts
                                    if(data_obj.inp && data_obj.inp.length > 0) {
                                        let inp_obj = data_obj.inp[0]
                                        obj.value = inp_obj.v[0]
                                        switch (inp_obj.s) {
                                            case 0:
                                                obj.status_device2 =  "0 - Ошибок нет!"
                                                break
                                            case 1:
                                                obj.status_device2 = "1 - Обрыв"
                                                break
                                            case 2:
                                                obj.status_device2 = "2 - Короткое Замыкание (КЗ)"
                                                break
                                            case 3:
                                                obj.status_device2 = "3 - Перерасход ресурса в единицу времени"
                                                break
                                            case 4:
                                                obj.status_device2 = "4 - Температура опустилась ниже нижнего порога"
                                                break
                                            case 5:
                                                obj.status_device2 = "5 - Температура поднялась выше верхнего порога;"
                                                break
                                            case 6:
                                                obj.status_device2 = "6 - Остановка потребления газа"
                                                break
                                            case 7:
                                                obj.status_device2 = "7 - Ошибка связи или Внутренняя неисправность счетчика с цифровым интерфейсом (RS-485/CAN/MBUS)"
                                                break
                                            case 8:
                                                obj.status_device2 = "8 - Некорректное значение или Выход значения за пределы измеряемого диапазон"
                                                break
                                            case 9:
                                                obj.status_device2 = "9 - Воздействие магнитного поля"
                                                break
                                            case 10:
                                                obj.status_device2 = "10 - Обратный ток жидкости"
                                                break
                                            default:
                                                obj.status_device2 = ""
                                                break
                                        }
                                    }
                                    obj.bat = data_obj.bat + "%"
                                }

                            }
                            device1Arr.push(obj)
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

exports.getCompany = (req, res) => {
    try {
        let {companyid} = req.headers
        device1.findAll({where:{companyId:companyid}})
            .then(async objects => {
                if (objects.length === 0) {
                    templase(500, "Не найдено ни одного устройства в этой компании", [], true, res)
                } else {
                    let device1Arr = []
                    for (let device1 of objects) {
                        try {
                            let obj = device1.dataValues
                            let resources = await resource.findByPk(device1.dataValues.resourceId)
                            obj.resource = resources

                            let devices = await device2.findOne({where: {sn: obj.device1_num}, order: [['createdAt', 'DESC']]})
                            if(devices) {
                                let device2_data = JSON.parse(devices.dataValues.data)
                                if (device2_data && device2_data.length > 0) {
                                    let data_obj = device2_data[device2_data.length - 1]
                                    obj.dateMessages = data_obj.ts
                                    if (data_obj.inp && data_obj.inp.length > 0) {
                                        let inp_obj = data_obj.inp[0]
                                        obj.value = inp_obj.v[0]
                                    }
                                }
                            }

                            device1Arr.push(obj)
                        } catch (e) {
                            templase(500, e.message, [], true, res)
                        }
                    }
                    templase(200, "", device1Arr, true, res)
                }
            })
            .catch(err => templase(500, err.message, [], true, res));
    } catch (e) {
        templase(500, e.message, [], true, res)
    }

};

exports.getObject = (req, res) => {
    let {id} = req.params
    try {
        device1.findByPk(id)
            .then(async object => {
                if (!object) {
                    templase(500, "Объект не найден!", [], true, res)
                } // если Объект не найден
                try {
                    let companies = await company.findByPk(object.dataValues.companyId)
                    let clientLegals = await clientLegal.findByPk(object.dataValues.clientLegalId)
                    let clientIndvs = await clientIndv.findByPk(object.dataValues.clientIndvId)
                    let resources = await resource.findByPk(object.dataValues.resourceId)
                    object.dataValues.company = companies
                    object.dataValues.clientLegal = clientLegals
                    object.dataValues.clientIndv = clientIndvs
                    object.dataValues.resource = resources
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
        device1.create(body).then(object=>{
            if (!object){
                templase(500,"Объект НЕ был зарегестрирован!",[],true,res)

            }
            templase(200,"Объект был успешно зарегестрирован!",[],true,res)


        }).catch(err => {
            templase(500, err.message,[],true,res)
        });
    }catch (e) {
        templase(500, e.message, [], true, res)

    }
};

exports.objectUpdate = (req, res) => {
    try {
        let {id} = req.params
        let {body} = req
        device1.update(body, {
            where: {
                id: id
            }
        }).then((response) => {
            if (response[0]){
                templase(200,"Объект был успешно обновлен!",[],true,res)
            } else {
                templase(500, "Объект НЕ найден!", [], true, res)

            }
        }).catch(e=>{
            templase(500, e.message, [], true, res)

        });

    }catch (e){
        templase(500, e.message, [], true, res)
    }
};

exports.objectDelete = (req, res) => {
    try{
        let {id} = req.params
        device1.destroy({
            where: {
                id: id
            }
        }).then((response) => {
            if (response === 1){
                templase(200,"Объект был успешно удален!",[],true,res)
            } else{
                templase(500,"Объект не найден!", [], true, res)
            }
        }).catch(e=>{
            templase(500, e.message, [], true, res)

        });
    }catch (e){
        templase(500, e.message, [], true, res)
    }
};
