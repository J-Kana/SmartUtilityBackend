const { authJwt } = require("../middleware");
const controller = require("../controllers/device1.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/rest/device1/",[authJwt.verifyToken, authJwt.isSuperAdmin], controller.allObject);

    app.get(
        "/api/rest/device1/:id",
        [authJwt.verifyToken , authJwt.isSuperAdmin],
        controller.getObject
    );

    app.get(
        "/api/rest/device1_company/",
        [authJwt.verifyToken],
        controller.getCompany
    );

    app.post(
        "/api/rest/device1/",
        [authJwt.verifyToken , authJwt.isSuperAdmin],
        controller.objectCreate
    );

    app.put(
        "/api/rest/device1/:id",
        [authJwt.verifyToken, authJwt.isSuperAdmin],
        controller.objectUpdate
    );
    app.delete(
        "/api/rest/device1/:id",
        [authJwt.verifyToken, authJwt.isSuperAdmin],
        controller.objectDelete
    );
};