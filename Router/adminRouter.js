const express = require("express");
// const uuidv4 = require("uuidv4");
const path = require("path");
const router = express.Router();
const controller = require("../controller/adminControl");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets/img");
  },
  filename: function (_, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (_, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({ storage, fileFilter });

router.get("/dash", controller.main);
router.get("/records", controller.getRecord);
router.post("/records", upload.single("passport"), controller.addRecord);
router.get("/record_single/:id", controller.getRecordSingle);
router.get("/payments", controller.getPayment);
router.post("/add_payments", controller.createPayment);
router.get("/payments_single/:id", controller.getPaymentSingle);

module.exports = router;
