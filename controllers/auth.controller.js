const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
let templase = require('../templateResponse')
exports.signup = (req, res) => {
    // Save User to Database
    try {
        User.create({
            login: req.body.login,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            roleId:req.body.role===undefined ?1:req.body.role
        })
            .then(user => {
                if (user) {
                    templase(200,"Пользователь успешно зарегистрирован!",[],false,res)

                } else {
                    templase(500, "",[],false,res)
                }
            })
            .catch(err => {
                templase(500, err.message,[],false,res)
            });
    }catch (err) {
        templase(500, err.message,[],false,res)
    }

};

exports.signin = (req, res) => {
    User.findOne({
        where: {
            login: req.body.login
        }
    })
        .then(user => {
            if (!user) {
                return  templase(404,"Имя пользователя или пароль неверный!",[],false,res)
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return  templase(401,"Имя пользователя или пароль неверный!",[],false,res)
            }

            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            templase(200,"",{
                accessToken: token
            },false,res)
        })
        .catch(err => {
            templase(500, err.message ,[],false,res)
        });
};
