const { authJwt,verifySignUp } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/rest/user/",
        [authJwt.verifyToken],
        controller.allUsers);

    app.get(
        "/api/rest/user/chek",
        [authJwt.verifyToken],
        controller.userChekToken
    );

    app.get(
        "/api/rest/user/:id",
        [authJwt.verifyToken],
        controller.userProfile
    );

    app.post(
        "/api/rest/user/",
        [authJwt.verifyToken , authJwt.isSuperAdminOrAdmin, verifySignUp.checkDuplicateUsernameOrEmail],
        controller.userCreate
    );

    app.put(
        "/api/rest/user/resetPassword",
        [authJwt.verifyToken],
        controller.resetPassword
    )

    app.put(
        "/api/rest/user/:id",
        [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin],
        controller.userUpdate
    );
    app.delete(
        "/api/rest/user/:id",
        [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin],
        controller.userDelete
    );

    app.post("/api/rest/user/emailCheck", controller.emailChecker);
};
