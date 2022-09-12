const mongoose = require('mongoose')
const shortid = require('shortid')

const Counsellors = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true,
        default: shortid.generate()
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String
    },
    dateOfBirth: {
        type: Date,  
    },
    qualifications: {
        type: String
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    fees: {
        type: Number,
        required: true,
        default: 100
    }
})

module.exports = mongoose.model('Counsellors', Counsellors)