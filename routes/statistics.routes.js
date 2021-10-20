const { authJwt,verifySignUp } = require("../middleware");
const controller = require("../controllers/statistics.controller");

module.exports = function(app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/rest/getStatics",
        [authJwt.verifyToken],
        controller.getStatics
    );

    app.post("/api/rest/getOneStatic",
        [authJwt.verifyToken],
        controller.getOneStatic
    );
}