const { authJwt } = require("../middleware");
const controller = require("../controllers/clientIndv.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/rest/clientindvs/",[authJwt.verifyToken], controller.allObject);

    app.get(
        "/api/rest/clientindvs/:id",
        [authJwt.verifyToken],
        controller.getObject
    );

    app.post(
        "/api/rest/clientindvs/",
        [authJwt.verifyToken , authJwt.isSuperAdminOrAdmin],
        controller.objectCreate
    );

    app.put(
        "/api/rest/clientindvs/:id",
        [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin],
        controller.objectUpdate
    );
    app.delete(
        "/api/rest/clientindvs/:id",
        [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin],
        controller.objectDelete
    );
};
