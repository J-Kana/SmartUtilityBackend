const { authJwt } = require("../middleware");
const controller = require("../controllers/company.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/rest/company/",[authJwt.verifyToken, authJwt.isSuperAdmin], controller.allObject);

    app.get(
        "/api/rest/company/:id",
        [authJwt.verifyToken],
        controller.getObject
    );

    app.post(
        "/api/rest/company/",
        [authJwt.verifyToken , authJwt.isSuperAdmin],
        controller.objectCreate
    );

    app.put(
        "/api/rest/company/:id",
        [authJwt.verifyToken, authJwt.isSuperAdmin],
        controller.objectUpdate
    );
    app.delete(
        "/api/rest/company/:id",
        [authJwt.verifyToken, authJwt.isSuperAdmin],
        controller.objectDelete
    );
};
