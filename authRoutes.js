const Router = require("express")
const router = new Router()
const controller = require("./authController")
const {check} = require("express-validator")
const authMiddleware = require("./middlewares/authMiddleware")
const roleMiddleware = require("./middlewares/roleMiddleware")

router.post("/registration",[
    check("username", "Username can't be empty").notEmpty(),
    check("password", "Password can't be less 4  and more than 10 symbols").isLength({min:4 , max:10})
], controller.registration)
router.post("/login", controller.login)
router.get("/users",  controller.getUsers)
router.put("/update/:id",  controller.update)
router.post("/refresh",  controller.refreshTokens)



module.exports = router
