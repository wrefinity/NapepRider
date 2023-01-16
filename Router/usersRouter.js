const express = require("express");
const router = express.Router();
const controller = require("../controller/usersController");
const { verifyTokenAndAdmin } = require("../middleware/authenticate");
const User = require("../model/usersModel");

router.get("/register", controller.regGet);
router.get("/profile", verifyTokenAndAdmin, controller.profile);
router.post("/profile", verifyTokenAndAdmin, (req, res) =>
  updateFunWithImage(req, res, User)
);
router.post("/registerProfile", controller.profile);

router.post("/register", controller.regPost);
router.get("/login", controller.login_get);
router.post("/login", controller.login_post);
router.get("/logout", controller.logout);

module.exports = router;
