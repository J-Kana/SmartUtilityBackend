const { authJwt } = require("../middleware");
const controller = require("../controllers/locations.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/rest/locations/",[authJwt.verifyToken], controller.allObject);

    app.get(
        "/api/rest/locations/:id",
        [authJwt.verifyToken],
        controller.getObject
    );

    app.post(
        "/api/rest/locations/",
        [authJwt.verifyToken , authJwt.isSuperAdminOrAdmin],
        controller.objectCreate
    );
    app.post(
        "/api/rest/locations/chekaddress",
        [authJwt.verifyToken ],
        controller.chekAddress
    );
    app.put(
        "/api/rest/locations/:id",
        [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin],
        controller.objectUpdate
    );
    app.delete(
        "/api/rest/locations/:id",
        [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin],
        controller.objectDelete
    );
};