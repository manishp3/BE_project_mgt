const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const generateJwtToken = (user) => {
    const payload = {
        _id: user._id,
        email: user.email,
        password: user.password,
    }
    const token = jwt.sign(payload, process.env.SECRET)
    // console.log("log of genrated token::", token);

    return token;
}

const verifyJwtToken = (token) => {

    const userPayload = jwt.verify(token, process.env.SECRET)
    // console.log("log of payload::", userPayload);

    return userPayload;

}


const handleOptSender = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODE_EMAIL_ADDRESS,
        pass: process.env.NODE_PASSWORD
    }
})

module.exports = {
    generateJwtToken,
    verifyJwtToken,
    handleOptSender
}