const mongoose = require("mongoose");

const codeSchema = mongoose.Schema(
  {
    email: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"signup",
      required: [true, "Email is Required"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Code is Required"],
    },
// createdAt: { type: Date, default: Date.now, expires: 300 } 
  },
  { timestamps: true }
);

const code_tbl = mongoose.model("verification_code", codeSchema);

module.exports = code_tbl;
