const { authJwt } = require("../middleware");
const controller = require("../controllers/resource.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/rest/resource/",[authJwt.verifyToken], controller.allObject);

    app.get(
        "/api/rest/resource/:id",
        [authJwt.verifyToken],
        controller.getObject
    );

    app.post(
        "/api/rest/resource/",
        [authJwt.verifyToken , authJwt.isSuperAdmin],
        controller.objectCreate
    );

    app.put(
        "/api/rest/resource/:id",
        [authJwt.verifyToken, authJwt.isSuperAdmin],
        controller.objectUpdate
    );
    app.delete(
        "/api/rest/resource/:id",
        [authJwt.verifyToken, authJwt.isSuperAdmin],
        controller.objectDelete
    );
};