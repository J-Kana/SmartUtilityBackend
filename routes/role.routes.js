const { authJwt } = require("../middleware");
const controller = require("../controllers/role.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/rest/role/",[authJwt.verifyToken], controller.allObject);

    app.get(
        "/api/rest/role/:id",
        [authJwt.verifyToken],
        controller.getObject
    );

    app.post(
        "/api/rest/role/",
        [authJwt.verifyToken],
        controller.objectCreate
    );

    app.put(
        "/api/rest/role/:id",
        [authJwt.verifyToken, authJwt.isSuperAdmin],
        controller.objectUpdate
    );
    app.delete(
        "/api/rest/role/:id",
        [authJwt.verifyToken, authJwt.isSuperAdmin],
        controller.objectDelete
    );
};