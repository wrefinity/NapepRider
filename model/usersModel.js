const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
      trim: true,
    },

    napepNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      minlength: 6,
      require: true,
    },
    role: {
      type: String,
      default: "napep",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.compareDetails = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const checkPass = await bcrypt.compare(password, user.password);
    if (checkPass) {
      return user;
    } else {
      throw Error("invalid password");
    }
  }
  throw Error("invalid email");
};
const User = mongoose.model("User", userSchema);
module.exports = User;
