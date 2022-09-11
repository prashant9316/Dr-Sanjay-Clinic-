const mongoose = require('mongoose')

const PatientLoginSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    role: { // User Role
        type: String,
        required: true,
        default: 'patient'
    },
    verification: { // User Verification 
        phoneNumber: {
            type: Boolean,
            default: false
        },
        email: {
            type: Boolean,
            default: false
        }
    }
})

module.exports = mongoose.model('PatientLogin', PatientLoginSchema);