const db = require("../models");
const template = require("../templateResponse")
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    User.findOne({
        where: {
            login: req.body.login
        }
    }).then(user => {
        if (user) {
            template(400,"Это имя пользователя уже занято!",[],true,res)
            return;
        }

        // Email
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then(user => {
            if (user) {
                template(400,"Электронный адрес уже используется!",[],true,res)
                return;
            }

            next();
        });
    });
};

// checkRolesExisted = (req, res, next) => {
//     if (req.body.roles) {
//         for (let i = 0; i < req.body.roles.length; i++) {
//             if (!ROLES.includes(req.body.roles[i])) {
//                 template(400,"Failed! Role does not exist = " + req.body.roles[i],[],false,res)
//                 return;
//             }
//         }
//     }
//
//     next();
// };

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
    // checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;
