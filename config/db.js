const mongoose = require("mongoose");
const User = require("../model/usersModel");

const dbCons = async () => {
  await mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(async (res) => {
      console.log("database connected");
      const admin = await User.findOne({ role: "admin" });
      if (!admin) {
        await User.create({
          fullname: process.env.FULL_NAME,
          email: process.env.ADMIN_EMAIL,
          role: process.env.ADMIN_ROLE,
          password: process.env.ADMIN_PASSWORD,
          napepNumber: process.env.FULL_NAME,
        });
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = dbCons;
