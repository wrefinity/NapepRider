const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
      trim: true,
    },
    firstname: { type: String },
    surname: { type: String },
    phone: { type: String },
    gender: { type: String },
    maritalStatus: { type: String },
    address: { type: String },
    stateOrigin: { type: String },
    localGovtOrigin: { type: String },
    bloodGroup: { type: String },
    disability: { type: String },
    nextOfKin: { type: String },
    napepNumber: {
      type: Number,
      unique: true,
    },
    passport: {
      type: String,
    },
  },
  { timestamps: true }
);

let modal;
recordSchema.pre("save", function (next) {
  if (this.isNew) {
    if (!modal) {
      modal = mongoose.model("Record");
    }
    modal.find({}).then((entries) => {
      this.napepNumber = entries.length + 1;
      next();
    });
  }
});
// recordSchema.pre("save", async function (next) {
//   if(this.napepNumber) {
//     let doc = await recordModel.findOne()
//     if(!doc) {
//       doc = new recordModel({napepNumber: 1})
//     } else {
//       doc.napepNumber++
//     }
//     this.napepNumber = doc.napepNumber
//     const response = await doc.save()
//   }
//   next();
// });

const recordModel = mongoose.model("Record", recordSchema);

module.exports = recordModel;
