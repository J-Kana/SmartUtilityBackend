const { authJwt } = require("../middleware");
const controller = require("../controllers/clientLegal.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/rest/clientlegal/",[authJwt.verifyToken], controller.allObject);

    app.get(
        "/api/rest/clientlegal/:id",
        [authJwt.verifyToken],
        controller.getObject
    );

    app.post(
        "/api/rest/clientlegal/",
        [authJwt.verifyToken , authJwt.isSuperAdminOrAdmin],
        controller.objectCreate
    );

    app.put(
        "/api/rest/clientlegal/:id",
        [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin],
        controller.objectUpdate
    );
    app.delete(
        "/api/rest/clientlegal/:id",
        [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin],
        controller.objectDelete
    );
};
