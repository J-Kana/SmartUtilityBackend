const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role
const  tamplate = require('../templateResponse')
verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return tamplate(400, "Токен не предоставлен!",[],false,res)
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return tamplate(400, "Неавторизованный",[],false,res)

        }
        req.userId = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        Role.findByPk(user.roleId).then(role => {
            if (role.value === "admin") {
                next();
                return;
            }
            tamplate(403, "Требуется роль администратора!",[],true,res)
            return;
        }).catch(error=>{
            tamplate(500, error.message,[],true,res)

        });
    });
};

isSuperAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        Role.findByPk(user.roleId).then(role => {
            if (role.value === "superadmin") {
                next();
                return;
            }
            tamplate(403, "Требуется роль супер-администратора!",[],true,res)
            return;
        }).catch(error=>{
            tamplate(500, error.message,[],true,res)

        });

    });
};

isSuperAdminOrAdmin = (req, res, next) => {
    try{
        User.findByPk(req.userId).then(user => {
            Role.findByPk(user.roleId).then(role => {
                if (role.value === "superadmin") {
                    next();
                    return;
                }
                if (role.value === "admin") {
                    next();
                    return;
                }
                tamplate(403, "Требуется роль супер-администратора!",[],true,res)
                return;
            }).catch(error=>{
                tamplate(500, error.message,[],true,res)

            });

        });
    }catch (e){
        console.log(e)
    }

};

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isSuperAdmin: isSuperAdmin,
    isSuperAdminOrAdmin: isSuperAdminOrAdmin
};
module.exports = authJwt;
