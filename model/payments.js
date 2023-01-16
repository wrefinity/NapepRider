const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    recordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Record",
      required: true,
    },
    amount: { type: String },
    fullname: { type: String },
    month: { type: String },
    year: { type: String },
  },
  { timestamps: true }
);

const payment = mongoose.model("payment", paymentSchema);
module.exports = payment;
