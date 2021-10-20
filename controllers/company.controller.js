const db = require("../models");
const Model = db.company;
const Resource = db.resource;
const City = db.city;
const templase = require("../templateResponse")
exports.allObject = (req, res) => {
    try {
        Model.findAll()
            .then(async objects => {
                if (objects.length === 0) {
                    templase(500, "Не найдено ни одного объекта", [], true, res)
                } else {
                    let companyArr = []
                    for(let company of objects) {
                        try {
                            let resourceArr = []
                            if(company.dataValues.resources != null) {
                                for(let val of company.dataValues.resources.split(",")) {
                                    let resource = await Resource.findByPk(val)
                                    if(resource != null) {
                                        resourceArr.push(resource)
                                    }
                                }
                            }
                            let cities = await City.findByPk(company.dataValues.cityId)
                            company.dataValues.city = cities
                            company.dataValues.resources = resourceArr
                            companyArr.push(company.dataValues)
                        } catch (e) {
                            templase(500, e.message, [], true, res)
                        }
                    }
                    templase(200, "", companyArr, true, res)
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
        Model.findByPk(id)
            .then(async object => {
                if (!object) {
                    templase(500, "Объект не найден", [], true, res)
                } // если Объект не найден
                try {
                    let cities = await City.findByPk(object.dataValues.cityId)
                    let resourceArr = []
                    if(object.dataValues.resources !== null) {
                        for(let val of object.dataValues.resources.split(",")) {
                            let resource = await Resource.findByPk(val)
                            if(resource != null) {
                                resourceArr.push(resource)
                            }
                        }
                    }
                    object.dataValues.city = cities
                    object.dataValues.resources = resourceArr
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
        Model.create(body).then(object=>{
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
        Model.update(body, {
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
        Model.destroy({
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
