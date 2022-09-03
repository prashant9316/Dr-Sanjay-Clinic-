const jwt = require('jsonwebtoken')

const generateToken = async(patientUser, role) => {
    if(!patientUser){
        return -1;
    } 
    const token = jwt.sign(
        {
            _id: patientUser._id,
            name: patientUser.name,
            role,
            phoneNumber: patientUser.phoneNumber,

        },
        process.env.SECRET_TOKEN
    )
    return token
}

module.exports = generateToken;