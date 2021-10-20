const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Notif = db.notification;
const Company = db.company;
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');

const templase = require("../templateResponse")
exports.allUsers = (req, res) => {
    try {
        let {companyid} = req.headers
        User.findAll({where:{companyId:companyid}})
            .then(async users => {
                if (users.length === 0) {
                    templase(500, "Не найдено не одного пользователя", [], true, res)
                } else {
                    let newUserArr = []
                    for (let user of users) {
                        try {
                            let roles = await Role.findByPk(user.dataValues.roleId)
                            delete user.dataValues.password
                            let notifArr = []
                            if (user.dataValues.notifications !== null){
                                for (let val of user.dataValues.notifications.split(",")){
                                    let notif = await Notif.findByPk(val)
                                    if (notif !== null){
                                        notifArr.push(notif)
                                    }
                                }
                            }
                            user.dataValues.role = roles
                            user.dataValues.company = await Company.findByPk(user.dataValues.companyId)
                            user.dataValues.notification = notifArr
                            newUserArr.push(user.dataValues)
                        } catch (e) {
                            templase(500, e.message, [], true, res)
                        }
                    }
                    templase(200, "", newUserArr, true, res)
                }
            })
            .catch(err => templase(500, err.message, [], true, res));
    } catch (e) {
        templase(500, e.message, [], true, res)
    }

};

exports.userChekToken = (req, res) => {
    try {
        let token = req.headers["x-access-token"];

        if (!token) {
            return templase(400, "Токен не предоставлен!", [], false, res)
        }

        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return templase(400, "Неавторизованный", [], false, res)

            }
            User.findByPk(decoded.id)
                .then(async user => {
                    if (!user) {
                        templase(500, "Пользователь не найден", [], false, res)
                    } // если пользователь не найден
                    try {
                        let roles = await Role.findByPk(user.dataValues.roleId)
                        delete user.dataValues.password
                        let notifArr = []

                        if (user.dataValues.notifications !== null){
                            for (let val of user.dataValues.notifications.split(",")){
                                let notif = await Notif.findByPk(val)
                                if (notif !== null){
                                    notifArr.push(notif)
                                }
                            }
                        }
                        user.dataValues.role = roles
                        user.dataValues.company = await Company.findByPk(user.dataValues.companyId)
                        user.dataValues.notification = notifArr
                        templase(200, "", user, true, res)
                    } catch (e) {
                        templase(500, e.message, [], true, res)

                    }
                })
                .catch(err => templase(500, err.message, [], true, res));

        });
    } catch (e) {
        templase(500, e.message, [], true, res)
    }
};

exports.userProfile = (req, res) => {
    let {id} = req.params
    try {
        User.findByPk(id)
            .then(async user => {
                if (!user) {
                    templase(500, "Пользователь не найден", [], true, res)
                } // если пользователь не найден
                console.log(user);
                try {
                    let roles = await Role.findByPk(user.dataValues.roleId)
                    delete user.dataValues.password
                    let notifArr = []

                    if (user.dataValues.notifications !== null){
                        for (let val of user.dataValues.notifications.split(",")){
                            let notif = await Notif.findByPk(val)
                            if (notif !== null){
                                notifArr.push(notif)
                            }
                        }
                    }
                    user.dataValues.role = roles
                    user.dataValues.company = await Company.findByPk(user.dataValues.companyId)

                    user.dataValues.notification = notifArr
                    templase(200, "", user, true, res)
                } catch (e) {
                    templase(500, e.message, [], true, res)

                }
            })
            .catch(err => templase(500, err.message, [], true, res));

    } catch (e) {
        templase(500, e.message, [], true, res)
    }
};

exports.userCreate = (req, res) => {
    try {
        let token = req.headers["x-access-token"];
        let {body} = req
        let pwd = Math.random().toString(36).slice(2)

        if (!token) {
            return templase(400, "Токен не предоставлен!", [], false, res)
        }

        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return templase(400, "Неавторизованный", [], false, res)
            }
            User.findByPk(decoded.id)
                .then(async obj => {
                    if (!obj) {
                        templase(500, "Пользователь не найден", [], true, res)
                    } // если пользователь не найден
                    try {
                        if(obj.roleId === 3){
                            if (body.roleId === 2) {
                                templase(500, "Требуется роль Супер-Администратора", [], true, res)
                            }
                            // console.log(obj);
                            else {
                                body.password= bcrypt.hashSync(pwd, 8)
                                body.roleId= body.roleId !== undefined ? body.roleId: 1
                                User.create(body) .then(user => {
                                    if (user) {
                                        /****************************************************************************************************/
                                        /*                         Рассылка писем для зарегестрированных пользователей                      */
                                        /****************************************************************************************************/
                                        let transporter = nodemailer.createTransport({
                                            host: 'smtp.yandex.ru',
                                            port: 465,
                                            secure: true,
                                            auth: {
                                                user: 'info@winext.kz',
                                                pass: 'Inert2012'
                                            }
                                        });

                                        let result = transporter.sendMail({
                                            from: '"Winext Innovations Company" <info@winext.kz>',
                                            to: [body.email],
                                            subject: "Подтверждение регистрации",
                                            text: "You have successfully registered on WinGate.",
                                            html: "<!DOCTYPE html>" +
                                                "<html lang=\"ru\">" +
                                                "<head>" +
                                                "    <meta charset=\"UTF-8\">" +
                                                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                                                "    <title>Подтверждение регистрации</title>" +
                                                "    <style>" +
                                                "        body{" +
                                                "            width: 600px;" +
                                                "            margin: 0;" +
                                                "            padding: 0;" +
                                                "        }" +
                                                "        .header{" +
                                                "            background-color: #002060;" +
                                                "            display: flex;" +
                                                "            justify-content:center;" +
                                                "        }" +
                                                "        .header h1{" +
                                                "            padding-top: 20px;" +
                                                "            text-align: center;" +
                                                "            font-size: 18px;" +
                                                "            color: #fff;" +
                                                "            padding-bottom: 20px;" +
                                                "        }" +
                                                "        .header .img img{" +
                                                "            width: 90px;" +
                                                "        }" +
                                                "        .footer{" +
                                                "            padding-top: 20px;" +
                                                "            padding: 20px;" +
                                                "            background-color: #002060;" +
                                                "            display: flex;" +
                                                "            color: #fff;" +
                                                "            justify-content:space-between;" +
                                                "        }" +
                                                "        .footer a{" +
                                                "            text-decoration:  none;" +
                                                "            color: #fff;" +
                                                "        }" +
                                                "        .content{" +
                                                "            padding: 20px;" +
                                                "        }" +
                                                "    </style>" +
                                                "</head>" +
                                                "<body>" +
                                                "    <div class=\"header\">" +
                                                "        <div>" +
                                                "            <h1>Подтверждение регистрации</h1>" +
                                                "        </div>" +
                                                "    </div>" +
                                                "    <div class=\"content\">" +
                                                "        <p>Уважаемый пользователь!Вы только что зарегистрировались в личном кабинете  системы «WinGate»" +
                                                "            </p><p>" +
                                                "               Ваш логин: " + body.login +
                                                "<br>Ваш пароль: " + pwd +
                                                "            </p>" +
                                                "            <p>Вы можете перейти в личный кабинет по ссылке  <a href=\"https://wingate.winext.kz/login\">wingate.winext.kz</a></p>" +
                                                "            <p>Если вы не регистрировались в системе, пожалуйста, проигнорируйте это письмо или сообщите нам об этом: <a href=\"mailto:support@winext.kz\">support@winext.kz</a></p>" +
                                                "    </div>" +
                                                "    <div class=\"footer\">" +
                                                "        <div>" +
                                                "            <img src=\"https://bmanhole2.winext.kz/uploads/winextLogoEmail.png\" alt=\"\">" +
                                                "        </div>" +
                                                "        <div>" +
                                                "            <a href=\"http://www.winext.kz\">www.winext.kz</a> <br>" +
                                                "            <a href=\"tel:+77172972713\">+7 (7172) 97-27-13</a><br>" +
                                                "            <a href=\"mailto:info@winext.kz\">info@winext.kz</a> <br>" +
                                                "        </p>" +
                                                "    </div>" +
                                                "</body>" +
                                                "</html>"
                                        });
                                        templase(200,"User was registered successfully!",[],false,res)
                                    } else {
                                        templase(500, "",[],false,res)
                                    }
                                }).catch(err => {
                                    templase(500, err.message,[],false,res)
                                });
                            }
                        }
                        else {
                            body.password= bcrypt.hashSync(pwd, 8)
                            body.roleId= body.roleId !== undefined ? body.roleId: 1
                            User.create(body) .then(user => {
                                if (user) {
                                    /****************************************************************************************************/
                                    /*                         Рассылка писем для зарегестрированных пользователей                      */
                                    /****************************************************************************************************/
                                    let transporter = nodemailer.createTransport({
                                        host: 'smtp.yandex.ru',
                                        port: 465,
                                        secure: true,
                                        auth: {
                                            user: 'info@winext.kz',
                                            pass: 'Inert2012'
                                        }
                                    });

                                    let result = transporter.sendMail({
                                        from: '"Winext Innovations Company" <info@winext.kz>',
                                        to: [body.email],
                                        subject: "Подтверждение регистрации",
                                        text: "You have successfully registered on WinGate.",
                                        html: "<!DOCTYPE html>" +
                                            "<html lang=\"ru\">" +
                                            "<head>" +
                                            "    <meta charset=\"UTF-8\">" +
                                            "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                                            "    <title>Подтверждение регистрации</title>" +
                                            "    <style>" +
                                            "        body{" +
                                            "            width: 600px;" +
                                            "            margin: 0;" +
                                            "            padding: 0;" +
                                            "        }" +
                                            "        .header{" +
                                            "            background-color: #002060;" +
                                            "            display: flex;" +
                                            "            justify-content:center;" +
                                            "        }" +
                                            "        .header h1{" +
                                            "            padding-top: 20px;" +
                                            "            text-align: center;" +
                                            "            font-size: 18px;" +
                                            "            color: #fff;" +
                                            "            padding-bottom: 20px;" +
                                            "        }" +
                                            "        .header .img img{" +
                                            "            width: 90px;" +
                                            "        }" +
                                            "        .footer{" +
                                            "            padding-top: 20px;" +
                                            "            padding: 20px;" +
                                            "            background-color: #002060;" +
                                            "            display: flex;" +
                                            "            color: #fff;" +
                                            "            justify-content:space-between;" +
                                            "        }" +
                                            "        .footer a{" +
                                            "            text-decoration:  none;" +
                                            "            color: #fff;" +
                                            "        }" +
                                            "        .content{" +
                                            "            padding: 20px;" +
                                            "        }" +
                                            "    </style>" +
                                            "</head>" +
                                            "<body>" +
                                            "    <div class=\"header\">" +
                                            "        <div>" +
                                            "            <h1>Подтверждение регистрации</h1>" +
                                            "        </div>" +
                                            "    </div>" +
                                            "    <div class=\"content\">" +
                                            "        <p>Уважаемый пользователь!Вы только что зарегистрировались в личном кабинете  системы «WinGate»" +
                                            "            </p><p>" +
                                            "               Ваш логин: " + body.login +
                                            "<br>Ваш пароль: " + pwd +
                                            "            </p>" +
                                            "            <p>Вы можете перейти в личный кабинет по ссылке  <a href=\"https://wingate.winext.kz/login\">wingate.winext.kz</a></p>" +
                                            "            <p>Если вы не регистрировались в системе, пожалуйста, проигнорируйте это письмо или сообщите нам об этом: <a href=\"mailto:support@winext.kz\">support@winext.kz</a></p>" +
                                            "    </div>" +
                                            "    <div class=\"footer\">" +
                                            "        <div>" +
                                            "            <img src=\"https://bmanhole2.winext.kz/uploads/winextLogoEmail.png\" alt=\"\">" +
                                            "        </div>" +
                                            "        <div>" +
                                            "            <a href=\"http://www.winext.kz\">www.winext.kz</a> <br>" +
                                            "            <a href=\"tel:+77172972713\">+7 (7172) 97-27-13</a><br>" +
                                            "            <a href=\"mailto:info@winext.kz\">info@winext.kz</a> <br>" +
                                            "        </p>" +
                                            "    </div>" +
                                            "</body>" +
                                            "</html>"
                                    });
                                    templase(200,"User was registered successfully!",[],false,res)
                                } else {
                                    templase(500, "",[],false,res)
                                }
                            }).catch(err => {
                                templase(500, err.message,[],false,res)
                            });
                        }
                    }catch (e) {
                        templase(500, e.message, [], true, res)
                    }
                })
                .catch(err => templase(500, err.message, [], true, res));
        });
    } catch (e) {
        templase(500, e.message, [], true, res)
    }
};

exports.userUpdate = (req, res) => {
    try {
        let token = req.headers["x-access-token"];
        let {id} = req.params
        let {body} = req

        if (!token) {
            return templase(400, "Токен не предоставлен!", [], false, res)
        }

        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return templase(400, "Неавторизованный", [], false, res)
            }
            User.findByPk(decoded.id)
                .then(async obj => {
                    if (!obj) {
                        templase(500, "Пользователь не найден", [], true, res)
                    } // если пользователь не найден

                    try {
                        if(obj.roleId === 3) {
                            User.findByPk(id)
                                .then(async user => {
                                    if (user.roleId === 2) {
                                        templase(500, "Требуется роль Супер-Администратора", [], true, res)
                                    }
                                    // console.log(obj);
                                    else {
                                        try {
                                            if (body.email !== user.dataValues.email && body.email !== "") {
                                                let emailDatabase = await User.findAll({where: {email: body.email}})
                                                if (emailDatabase.length > 0) {
                                                    templase(500, "Такой элесктронный адрес уже существует!", [], true, res)
                                                    return false;
                                                }

                                            }

                                            if (body.oldpassword && body.password) {
                                                let passwordIsValid = bcrypt.compareSync(
                                                    body.oldpassword,
                                                    user.password
                                                );
                                                if (passwordIsValid) {
                                                    body.password = bcrypt.hashSync(body.password, 8)
                                                } else {
                                                    templase(500, "Не верный старый пароль!", [], true, res)
                                                    return false
                                                }
                                                User.update(body, {
                                                    where: {id: id}
                                                }).then((ressponse) => {
                                                    if (ressponse[0]) {
                                                        templase(200, "", [], true, res)
                                                    }
                                                }).catch(e => {
                                                    templase(500, e.message, [], true, res)

                                                });
                                            } else {
                                                delete body.password
                                                User.update(body, {
                                                    where: {id: id}
                                                }).then((ressponse) => {
                                                    if (ressponse[0]) {
                                                        templase(200, "", [], true, res)
                                                    }
                                                }).catch(e => {
                                                    templase(500, e.message, [], true, res)

                                                });
                                            }
                                        } catch (e) {
                                            templase(500, e.message, [], true, res)
                                        }
                                    }
                                })
                                .catch(err => templase(500, err.message, [], true, res));
                        }
                        else {
                            User.findByPk(id)
                                .then(async user => {
                                    try {
                                        if (body.email !== user.dataValues.email && body.email !== "") {
                                            let emailDatabase = await User.findAll({where: {email: body.email}})
                                            if (emailDatabase.length > 0) {
                                                templase(500, "Такой элесктронный адрес уже существует!", [], true, res)
                                                return false;
                                            }
                                        }
                                        if (body.oldpassword && body.password) {
                                            let passwordIsValid = bcrypt.compareSync(
                                                body.oldpassword,
                                                user.password
                                            );
                                            if (passwordIsValid) {
                                                body.password = bcrypt.hashSync(body.password, 8)
                                            } else {
                                                templase(500, "Не верный старый пароль!", [], true, res)
                                                return false
                                            }
                                            User.update(body, {
                                                where: {id: id}
                                            }).then((ressponse) => {
                                                if (ressponse[0]) {
                                                    templase(200, "", [], true, res)
                                                }
                                            }).catch(e => {
                                                templase(500, e.message, [], true, res)
                                            });
                                        } else {
                                            delete body.password
                                            User.update(body, {
                                                where: {id: id}
                                            }).then((ressponse) => {
                                                if (ressponse[0]) {
                                                    templase(200, "", [], true, res)
                                                }
                                            }).catch(e => {
                                                templase(500, e.message, [], true, res)
                                            });
                                        }
                                    } catch (e) {
                                        templase(500, e.message, [], true, res)
                                    }
                                })
                                .catch(err => templase(500, err.message, [], true, res));
                        }
                    } catch (e) {
                        templase(500, e.message, [], true, res)
                    }
                })
                .catch(err => templase(500, err.message, [], true, res));
        });
    } catch (e) {
        templase(500, e.message, [], true, res)
    }
};

exports.userDelete = (req, res) => {
    try {
        let token = req.headers["x-access-token"];
        let {id} = req.params

        if (!token) {
            return templase(400, "Токен не предоставлен!", [], false, res)
        }

        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return templase(400, "Неавторизованный", [], false, res)

            }
            User.findByPk(decoded.id)
                .then(async user => {
                    if (!user) {
                        templase(500, "Пользователь не найден", [], true, res)
                    } // если пользователь не найден
                    try {
                        if(user.roleId === 3) {
                            User.findByPk(id).then(
                                async object => {
                                    if(object.roleId === 2) {
                                        templase(500, "Требуется роль Супер-Администратора", [], true, res)
                                    }
                                    else {
                                        User.destroy({
                                            where: {
                                                id: id
                                            }
                                        }).then((response) => {
                                            if (response === 1) {
                                                templase(200, "", [], true, res)
                                            } else {
                                                templase(500, "Пользователь не найден", [], true, res)
                                            }
                                        }).catch(e => {
                                            templase(500, e.message, [], true, res)

                                        });
                                    }
                                }
                            )
                        }
                        else {
                            User.destroy({
                                where: {
                                    id: id
                                }
                            }).then((response) => {
                                if (response === 1) {
                                    templase(200, "", [], true, res)
                                } else {
                                    templase(500, "Пользователь не найден", [], true, res)
                                }
                            }).catch(e => {
                                templase(500, e.message, [], true, res)

                            });
                        }
                    } catch (e) {
                        templase(500, e.message, [], true, res)
                    }
                })
                .catch(err => templase(500, err.message, [], true, res));
        });
    } catch (e) {
        templase(500, e.message, [], true, res)
    }
};

exports.emailChecker = (req, res) => {
    let {body} = req
    User.findOne({
        where: {
            email: body.email
        }
    })
        .then(user => {
            if (!user) {
                return  templase(404,"Неверный адрес электронной почты!",[],true,res)
            }

            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 7200 // 2 hours
            });

            /****************************************************************************************************/
            /*                               Рассылка писем для восстановления паролей                          */
            /****************************************************************************************************/
            let transporter = nodemailer.createTransport({
                host: 'smtp.yandex.ru',
                port: 465,
                secure: true,
                auth: {
                    user: 'info@winext.kz',
                    pass: 'Inert2012'
                }
            });

            let result = transporter.sendMail({
                from: '"Winext Innovations Company" <info@winext.kz>',
                to: body.email,
                subject: "Восстановление пароля",
                text: "Click on the link below.",
                html: "<!DOCTYPE html>" +
                    "<html lang=\"ru\">" +
                    "<head>" +
                    "    <meta charset=\"UTF-8\">" +
                    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                    "    <title>Восстановление пароля</title>" +
                    "    <style>" +
                    "        body{" +
                    "            width: 600px;" +
                    "            margin: 0;" +
                    "            padding: 0;" +
                    "        }" +
                    "        .header{" +
                    "            background-color: #002060;" +
                    "            display: flex;" +
                    "            justify-content:center;" +
                    "        }" +
                    "        .header h1{" +
                    "            padding-top: 20px;" +
                    "            text-align: center;" +
                    "            font-size: 18px;" +
                    "            color: #fff;" +
                    "            padding-bottom: 20px;" +
                    "        }" +
                    "        .header .img img{" +
                    "            width: 90px;" +
                    "        }" +
                    "        .footer{" +
                    "            padding-top: 20px;" +
                    "            padding: 20px;" +
                    "            background-color: #002060;" +
                    "            display: flex;" +
                    "            color: #fff;" +
                    "            justify-content:space-between;" +
                    "        }" +
                    "        .footer a{" +
                    "            text-decoration:  none;" +
                    "            color: #fff;" +
                    "        }" +
                    "        .content{" +
                    "            padding: 20px;" +
                    "        }" +
                    "    </style>" +
                    "</head>" +
                    "<body>" +
                    "    <div class=\"header\">" +
                    "        <div>" +
                    "            <h1>Восстановление пароля </h1>" +
                    "        </div>" +
                    "    </div>" +
                    "    <div class=\"content\">" +
                    "        <p>Уважаемый пользователь!</p>" +
                    "        <p>Вы получили данное письмо, поскольку нам был направлен запрос на сброс пароля.</p>" +
                    "        <p>Чтобы сбросить пароль, нажмите на ссылку ниже: <a href=\"https://wingate.winext.kz/resetpassword/" + token + "\">https://wingate.winext.kz/resetpassword/" + token + "</a></p>" +
                    "        <p>Если вы не запрашивали сброс пароля, пожалуйста, проигнорируйте это письмо или сообщите нам об этом: <a href=\"mailto:support@winext.kz\">support@winext.kz</a></p>" +
                    "    </div>" +
                    "    <div class=\"footer\">" +
                    "        <div>" +
                    "            <img src=\"https://bmanhole2.winext.kz/uploads/winextLogoEmail.png\" alt=\"\">" +
                    "        </div>" +
                    "        <div>" +
                    "            <a href=\"http://www.winext.kz\">www.winext.kz</a> <br>" +
                    "            <a href=\"tel:+77172972713\">+7 (7172) 97-27-13</a><br>" +
                    "            <a href=\"mailto:info@winext.kz\">info@winext.kz</a> <br>" +
                    "        </p>" +
                    "    </div>" +
                    "</body>" +
                    "</html>"
            });
            console.log(result);

            templase(200,"",{},true,res)
        })
        .catch(err => {
            templase(500, err.message ,[], true,res)
        });
};

exports.resetPassword = (req, res) => {
    try {
        let token = req.headers["x-access-token"];
        let {body} = req;

        if (!token) {
            return templase(400, "Токен не предоставлен!", [], true, res)
        }

        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return templase(400, "Неавторизованный", [], true, res)
            }
            User.findByPk(decoded.id)
                .then(async user => {
                    if (!user) {    // если пользователь не найден
                        templase(500, "Пользователь не найден", [], true, res)
                    }
                    try {
                        if(body.password) {
                            body.password = bcrypt.hashSync(body.password, 8)

                            User.update(body, {
                                where: {id: decoded.id}
                            }).then((ressponse) => {
                                if (ressponse[0]) {
                                    templase(200, "", [], true, res)
                                }
                            }).catch(e => {
                                templase(500, e.message, [], true, res)
                            });
                        }
                    } catch (e) {
                        templase(500, e.message, [], true, res)
                    }
                })
                .catch(err => templase(500, err.message, [], true, res));
        });
    } catch (e) {
        templase(500, e.message, [], true, res)
    }
};
