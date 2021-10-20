const { authJwt } = require("../middleware");
const controller = require("../controllers/apartments.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/rest/apartment/",[authJwt.verifyToken], controller.allObject);

    app.get(
        "/api/rest/apartment/:id",
        [authJwt.verifyToken],
        controller.getObject
    );

    app.post(
        "/api/rest/apartment/",
        [authJwt.verifyToken , authJwt.isSuperAdminOrAdmin],
        controller.objectCreate
    );

    app.put(
        "/api/rest/apartment/:id",
        [authJwt.verifyToken, authJwt.isSuperAdmin],
        controller.objectUpdate
    );
    app.delete(
        "/api/rest/apartment/:id",
        [authJwt.verifyToken, authJwt.isSuperAdmin],
        controller.objectDelete
    );
};