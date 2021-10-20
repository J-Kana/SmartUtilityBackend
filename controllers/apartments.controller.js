const db = require("../models/");
const Apartment = db.apartment;
const House = db.house;
const templase = require('../templateResponse')
exports.allObject = (req, res) => {
    try {
        Apartment.findAll()
            .then(async objects => {
                if (objects.length === 0) {
                    templase(500, "Не найдено ни одного объекта!", [], true, res)
                } else {
                    let apartmentArr = []
                    for(let apartment of objects) {
                        try {
                            let houses = await House.findByPk(apartment.dataValues.houseId)
                            apartment.dataValues.house = houses
                            apartmentArr.push(apartment.dataValues)
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
        Apartment.findByPk(id)
            .then(async object => {
                if (!object) {
                    templase(500, "Объект не найден!", [], true, res)
                } // если Объект не найден
                try {
                    let houses = await House.findByPk(object.dataValues.houseId)
                    object.dataValues.house = houses
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
        Apartment.create(body).then(object=>{
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
        Apartment.update(body, {
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
        Apartment.destroy({
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
