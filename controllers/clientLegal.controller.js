const db = require("../models");
const clientLegal = db.clientLegal;
const company = db.company;
const apartment = db.apartment;
const clientLT = db.clientLT;
const device1 = db.device1;
const templase = require("../templateResponse")
exports.allObject = (req, res) => {
    try {
        clientLegal.findAll()
            .then(async objects => {
                if (objects.length === 0) {
                    templase(500, "Не найдено не одного объекта", [], true, res)
                  } else {
                    let LegalArr = []
                    for(let clientLegal of objects) {
                        try {
                            let companies = await company.findByPk(clientLegal.dataValues.companyId)
                            let apartments = await apartment.findByPk(clientLegal.dataValues.apartmentId)
                            let clientLTs = await clientLT.findByPk(clientLegal.dataValues.clientLegalTypeId)
                            clientLegal.dataValues.company = companies
                            clientLegal.dataValues.apartment = apartments
                            clientLegal.dataValues.clientLT = clientLTs
                            LegalArr.push(clientLegal.dataValues)
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
        clientLegal.findByPk(id)
            .then(async object => {
                if (!object) {
                    templase(500, "Объект не найден", [], true, res)
                } // если Объект не найден
                try {
                    let apartments = await apartment.findByPk(object.dataValues.apartmentId)
                    let clientLTs = await clientLT.findByPk(object.dataValues.clientLegalTypeId)
                    let companies = await company.findByPk(object.dataValues.companyId)
                    object.dataValues.company = companies
                    object.dataValues.apartment = apartments
                    object.dataValues.clientLT = clientLTs
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
        clientLegal.create(body).then(object=>{
            if (!object){
                templase(500,"Object was registered error!",[],true,res)

            }
            templase(200,"Object was registered successfully!",[],true,res)


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
        clientLegal.update(body, {
            where: {
                id: id
            }
        }).then((ressponse) => {
            if (ressponse[0]){
                templase(200,"",[],true,res)
            }else {
                templase(500, "Объект не найден", [], true, res)

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
        if(device1.findAll({where: {clientIndvId: id}}).length) {
            device1.findOne({where: {clientLegalId: id}})
                .then(async objects => {
                    for(let object of objects) {
                        let obj = {clientLegalId: null}
                        device1.update(obj, {
                            where: {
                                clientLegalId: id
                            }
                        });
                        clientLegal.destroy({
                            where: {
                                id: id
                            }
                        }).then((response) => {
                            if (response === 1) {
                                templase(200, "", [], true, res)
                            } else {
                                templase(500, "Объект не найден", [], true, res)
                            }
                        }).catch(e => {
                            templase(500, e.message, [], true, res)
                        });
                    }
                })
                .catch(err => templase(500, err.message, [], true, res))
        } else {
            clientLegal.destroy({
                where: {
                    id: id
                }
            }).then((response) => {
                if (response === 1) {
                    templase(200, "", [], true, res)
                } else {
                    templase(500, "Объект не найден", [], true, res)
                }
            }).catch(e => {
                templase(500, e.message, [], true, res)
            });
        }
    }catch (e){
        templase(500, e.message, [], true, res)
    }
};
