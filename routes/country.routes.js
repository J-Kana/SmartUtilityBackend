const { authJwt } = require("../middleware");
const controller = require("../controllers/country.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/rest/country/",[authJwt.verifyToken], controller.allObject);

    app.get(
        "/api/rest/country/:id",
        [authJwt.verifyToken],
        controller.getObject
    );

    app.post(
        "/api/rest/country/",
        [authJwt.verifyToken , authJwt.isSuperAdmin],
        controller.objectCreate
    );

    app.put(
        "/api/rest/country/:id",
        [authJwt.verifyToken, authJwt.isSuperAdmin],
        controller.objectUpdate
    );
    app.delete(
        "/api/rest/country/:id",
        [authJwt.verifyToken, authJwt.isSuperAdmin],
        controller.objectDelete
    );
};