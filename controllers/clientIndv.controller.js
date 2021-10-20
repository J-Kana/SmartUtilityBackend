const db = require("../models");
const clientIndv = db.clientIndv;
const Company = db.company;
const Apartment = db.apartment;
const clientPR = db.clientPR;
const device1 = db.device1;
const templase = require("../templateResponse")
exports.allObject = (req, res) => {
    try {
        clientIndv.findAll()
            .then(async objects => {
                if (objects.length === 0) {
                    templase(500, "Не найдено не одного объекта", [], true, res)
                } else {
                    let IndvArr = []
                    for(let clientIndv of objects) {
                        try {
                            let companies = await Company.findByPk(clientIndv.dataValues.companyId)
                            let apartments = await Apartment.findByPk(clientIndv.dataValues.apartmentId)
                            let clientPRs = await clientPR.findByPk(clientIndv.dataValues.clientIndvPRId)
                            clientIndv.dataValues.company = companies
                            clientIndv.dataValues.apartment = apartments
                            clientIndv.dataValues.clientPR = clientPRs
                            IndvArr.push(clientIndv.dataValues)
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
        clientIndv.findByPk(id)
            .then(async object => {
                if (!object) {
                    templase(500, "Объект не найден", [], true, res)
                } // если Объект не найден
                try {
                    let apartments = await Apartment.findByPk(object.dataValues.apartmentId)
                    let clientPRs = await clientPR.findByPk(object.dataValues.clientIndvPRId)
                    let companies = await Company.findByPk(object.dataValues.companyId)
                    object.dataValues.company = companies
                    object.dataValues.apartment = apartments
                    object.dataValues.clientPR = clientPRs
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
        clientIndv.create(body).then(object=>{
            if (!object){
                templase(500,"Object was registered error!",[],true,res)

            }
            templase(200,"Object was registered successfully!",[],true,res)


        }).catch(err => {
            templase(500, err.message,[],true,res)
        });
    } catch (e) {
        templase(500, e.message, [], true, res)

    }
};

exports.objectUpdate = (req, res) => {
    try {
        let {id} = req.params
        let {body} = req
        clientIndv.update(body, {
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

    } catch (e){
        templase(500, e.message, [], true, res)
    }
};

exports.objectDelete = (req, res) => {
    try{
        let {id} = req.params
        if(device1.findAll({where: {clientIndvId: id}}).length) {
            device1.findAll({where: {clientIndvId: id}})
                .then(async objects => {
                    for(let object of objects) {
                        let obj = {clientIndvId:null}
                        device1.update(obj, {
                            where: {
                                clientIndvId: id
                            }
                        });
                        clientIndv.destroy({
                            where: {
                                id: id
                            }
                        }).then((response) => {
                            if (response === 1){
                                templase(200,"",[],true,res)
                            }else{
                                templase(500,"Объект не найден", [], true, res)
                            }
                        }).catch(e=>{
                            templase(500, e.message, [], true, res)

                        });
                    }
                })
                .catch(err => templase(500, err.message,[], true, res))
        } else {
            clientIndv.destroy({
                where: {
                    id: id
                }
            }).then((response) => {
                if (response === 1){
                    templase(200,"",[],true,res)
                }else{
                    templase(500,"Объект не найден", [], true, res)
                }
            }).catch(e=>{
                templase(500, e.message, [], true, res)

            });
        }
    } catch (e){
        templase(500, e.message, [], true, res)
    }
};
