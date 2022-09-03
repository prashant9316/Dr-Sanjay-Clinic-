const jwt = require('jsonwebtoken')
const PatientUser = require('./../models/Patient/patientLogin')

const detectValidJwt = (req) => {
    const token = req.cookies.AuthToken;

    if(!token){
        return false
    }
    const verified = jwt.verify(token, process.env.SECRET_TOKEN);
    if(!verified)
    return false
    return verified;
}

module.exports = {
    detectValidJwt
}