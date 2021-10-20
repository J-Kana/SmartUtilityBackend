const db = require("../models/");
const Street = db.street;
const MicroRegion = db.microregion;
const templase = require('../templateResponse')
exports.allObject = (req, res) => {
    try {
        Street.findAll()
            .then(async objects => {
                if (objects.length === 0) {
                    templase(500, "Не найдено ни одного объекта!", [], true, res)
                } else {
                    let StreetArr = []
                    for(let street of objects) {
                        try {
                            let microregions = await MicroRegion.findByPk(street.dataValues.microregionId)
                            street.dataValues.microregion = microregions
                            StreetArr.push(street.dataValues)
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
        Street.findByPk(id)
            .then(async object => {
                if (!object) {
                    templase(500, "Объект не найден!", [], true, res)
                } // если Объект не найден
                try {
                    let microregions = await MicroRegion.findByPk(object.dataValues.microregionId)
                    object.dataValues.microregion = microregions
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
        Street.create(body).then(object=>{
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
        Street.update(body, {
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
        Street.destroy({
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
