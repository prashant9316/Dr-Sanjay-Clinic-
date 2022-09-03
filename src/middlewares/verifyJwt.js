const jwt = require('jsonwebtoken')
const User = require('./../models/Patient/patientLogin')

module.exports = verifyToken = async(req, res, next) => {
    // const token = req.header('AuthToken')
    const token = req.cookies.AuthToken
    // const token = req.session.AuthToken
    // console.log(token)
    if(!token) return res.redirect('/')

    try {
        const verified = jwt.verify(token, process.env.SECRET_TOKEN)
        req.user = verified;
        next();
    } catch(error) {
        return res.status(400).send("Invalid Token!");
    }
}