const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { generateJwtToken } = require("../service/auth");
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is Required"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is Required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    salt: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  console.log("im called prevase ::", user);

  const salt = randomBytes(16).toString();
  const hashedpassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashedpassword;
  next();
});
userSchema.static("matchPassword", async function (email, password) {
  try {
    // const user = this;
    // console.log("log of user in matchPassword::1",user);
    // console.log("log of user in matchPassword::2",email,password);

    const data = await this.findOne({ email })
    console.log("log of user in matchPassword::3", data);
    if (!data) {
      throw new Error("User not found!")
    }
    const hashedpwd = data.password;
    const salt = data.salt;

    const hashedpassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    if (hashedpassword != hashedpwd) {
      throw new Error("Wrong Password!")
      // return res.status(401).json({ msg: "Wrong password", success: false })
    }
    const token = generateJwtToken(data)
    console.log("log og token mstach::",token);
    
    return token;

  } catch (error) {
    throw new Error("Error in match Password")
  }
});
const signUp = mongoose.model("signup", userSchema);

module.exports = signUp;
