const mongoose = require('mongoose')
const shortid = require('shortid')

const PatientProfile = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    patientId: {
        type: String,
        required: true,
        default: shortid.generate()
    },
    phoneNumber: {
        type: String,
        required: true,
        length: 10,
        unique: true,
        sparse: true
    },
    emailId: {
        type: String,
    },
    age: {
        type: Number
    },
    address: {
        type: String,
    },
    gender: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
    },

})

module.exports = mongoose.model('PatientProfile', PatientProfile)