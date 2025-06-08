const { verifyJwtToken } = require("../service/auth")

const validateAuthToken = (cookiename) => {
    return (req, res, next) => {

        // console.log("validateAuthToken::", req.cookies[cookiename]);

        const tokenValue = req.cookies[cookiename]
        if (!tokenValue) {
            return res.status(401).json({ msg: "unauthorized :No Token", success: false })
        }

        try {
            // console.log("toke value from validate token::", tokenValue);

            const userpayload = verifyJwtToken(tokenValue)
            req.user = userpayload
            return next()

        } catch (error) {

        }
    }

}

module.exports = {
    validateAuthToken
}