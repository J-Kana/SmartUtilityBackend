const db = require("../models");
const device2 = db.device2;

let templase = require('../templateResponse')

exports.objectCreate = (req, res) => {
    try {
        let {body} = req
        console.log(req)
        if(body.data && body.data.length > 0){
            let object = body.data[body.data.length - 1]
            if(object){
                body.ms = object.ts
            }
        }
        body.data = JSON.stringify(body.data)

        device2.create(body).then(object=>{
            if (!object){
                templase(500,"Объект НЕ был зарегестрирован!",[],true,res)
            }

            templase(200,"Объект был успешно зарегестрирован!",[],true,res)

        }).catch(err => {
            templase(500, err.message,[],true,res)
        });
    } catch (e) {
        templase(500, e.message, [], true, res)
    }
};

