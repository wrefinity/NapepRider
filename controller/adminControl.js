const Records = require("../model/records");
const Payments = require("../model/payments");
const qr = require("qrcode");
// const pdfParse = require("pdf-parse");

class RecordRepo {
  main = async (_, res) => {
    res.render("dashboard");
  };

  getRecord = async (req, res) => {
    try {
      const username = req.user.username;
      const records = await Records.find({ username: username });
      console.log(records);
      return res.render("records", { records });
    } catch (e) {
      return res.render("records");
    }
  };
  getRecordSingle = async (req, res) => {
    const rId = req.params.id;
    try {
      const record = await Records.findById(rId);
      const to_qrcode = {
        id: record._id,
        firstname: record.firstname,
        surname: record.surname,
        napepNumber: record.napepNumber,
      };
      let strData = JSON.stringify(to_qrcode);
      const filename = `${record.firstname + Date.now()}.png`;
      qr.toFile(`public/assets/img/${filename}`, strData, function (err) {
        if (err) return console.log("error occurred");
      });
      qr.toString(strData, { type: "terminal" }, function (err, code) {
        if (err) return console.log("error occurred");
        console.log(code);
      });
      qr.toDataURL(strData, function (err, code) {
        if (err) return console.log("error occurred");
        // codex = code;
        console.log(code);
      });
      const records = { ...record._doc, qrcode: filename };
      console.log(records);
      return res.render("record_single", {
        records: records,
      });
    } catch (e) {
      return res.render("records");
    }
  };
  addRecord = async (req, res) => {
    console.log("i was called");
    try {
      if (req.file == undefined) {
        return res.send(`You must select a file.`);
      }
      const passport = req.file.filename;
      const {
        firstname,
        surname,
        email,
        gender,
        phone,
        maritalStatus,
        address,
        stateOrigin,
        localGovtOrigin,
        bloodGroup,
        disability,
        nextOfKin,
      } = req.body;
      // const counter = await Records.countDocuments({});
      console.log("image printing");
      console.log(passport);
      const rec = Records.create({
        firstname,
        surname,
        phone,
        email,
        gender,
        maritalStatus,
        address,
        stateOrigin,
        localGovtOrigin,
        bloodGroup,
        disability,
        nextOfKin,
        passport,
      });
      // if success return json qr code;
      const to_qrcode = {
        id: rec._id,
        month: rec.month,
        year: rec.year,
        napepNumber: rec.napepNumber,
      };
      let strData = JSON.stringify(to_qrcode);
      qr.toString(strData, { type: "terminal" }, function (err, code) {
        if (err) return console.log("error occurred");
        console.log(code);
      });
      qr.toDataURL(strData, function (err, code) {
        if (err) return console.log("error occurred");

        console.log(code);
      });

      if (rec) return res.json({ rec });
      return res.json({ mess: "Oop something went wrong !!!" });
    } catch (e) {
      console.log(e);
    }
  };
  getPayment = async (req, res) => {
    try {
      const records = await Payments.find({});
      return res.render("payments", { records });
    } catch (e) {
      return res.render("payments", { records: {} });
    }
  };
  createPayment = async (req, res) => {
    try {
      const { recordId, amount, fullname, month, year } = req.body;
      const rec = Payments.create({
        recordId,
        amount,
        fullname,
        month,
        year,
      });

      if (rec) return res.render("payments");
      return res.json({ mess: "Oop something went wrong !!!" });
    } catch (e) {
      console.log(e);
    }
  };

  getPaymentSingle = async (req, res) => {
    const rId = req.params.id;
    try {
      const record = await Payments.findById(rId);
      const user = await Records.findById(record.recordId);
      const to_qrcode = {
        id: record.recordId,
        fullname: record.fullname,
        amount: record.amount,
        amount: record.amount,
        napepNumber: user.napepNumber,
      };
      let strData = JSON.stringify(to_qrcode);
      const filename = `${record.fullname + Date.now()}.png`;
      qr.toFile(`public/assets/img/${filename}`, strData, function (err) {
        if (err) return console.log("error occurred");
      });
      const records = { ...record._doc, qrcode: filename };
      console.log(records);
      return res.render("payment_single", { records });
    } catch (e) {
      return res.render("payment_single", { records: {} });
    }
  };
}
module.exports = new RecordRepo();

// const qr = require('qrcode');

// let data = {
//     id: 1,
//     name: "User",
//     email: "user@gmail.com"
// };

// let strData = JSON.stringify(data)

// qr.toString(strData, {type:'terminal'},
//                     function (err, code) {

//     if(err) return console.log("error occurred")

//     console.log(code)
// });

// qr.toDataURL(strData, function (err, code) {
//     if(err) return console.log("error occurred")

//     console.log(code)
// })
