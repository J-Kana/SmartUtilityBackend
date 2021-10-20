const { authJwt } = require("../middleware");
const controller = require("../controllers/clientLegal_Type.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/rest/clientLT/",[authJwt.verifyToken], controller.allObject);

    app.get(
        "/api/rest/clientLT/:id",
        [authJwt.verifyToken],
        controller.getObject
    );

    app.post(
        "/api/rest/clientLT/",
        [authJwt.verifyToken , authJwt.isSuperAdmin],
        controller.objectCreate
    );

    app.put(
        "/api/rest/clientLT/:id",
        [authJwt.verifyToken, authJwt.isSuperAdmin],
        controller.objectUpdate
    );
    app.delete(
        "/api/rest/clientLT/:id",
        [authJwt.verifyToken, authJwt.isSuperAdmin],
        controller.objectDelete
    );
};