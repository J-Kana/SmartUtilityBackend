const db = require("../models/");
const City = db.city;
const Country = db.country;
const templase = require('../templateResponse')
exports.allObject = (req, res) => {
    try {
        City.findAll()
            .then(async objects => {
                if (objects.length === 0) {
                    templase(500, "Не найдено ни одного объекта!", [], true, res)
                } else {
                    let cityArr = []
                    for(let city of objects) {
                        try {
                            let countries = await Country.findByPk(city.dataValues.countryId)
                            city.dataValues.country = countries
                            cityArr.push(city.dataValues)
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

exports.getObject = (req, res) => {
    let {id} = req.params
    try {
        City.findByPk(id)
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
        City.create(body).then(object=>{
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
        City.update(body, {
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
        City.destroy({
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
