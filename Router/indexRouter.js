const express = require("express")
const controller = require('../controller/usersController')


const router = express.Router()
router.get("/", controller.login_get)
router.post("/", controller.login_post)

module.exports = router 