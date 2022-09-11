const jwt = require('jsonwebtoken')

const generateToken = async(patientUser) => {
    if(!patientUser){
        return -1;
    } 
    if(patientUser.name == undefined){
        patientUser.name = ''
    }
    const token = jwt.sign(
        {
            _id: patientUser._id,
            name: patientUser.name,
            role: patientUser.role,
            phoneNumber: patientUser.phoneNumber,

        },
        process.env.SECRET_TOKEN
    )
    return token
}

module.exports = generateToken;