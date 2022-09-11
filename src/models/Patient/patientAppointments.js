const mongoose = require('mongoose')
const shortid = require('shortid')

const PatientAppointments = new mongoose.Schema({
    appointmentId: {
        type: String,
        unique: true,
        required: true,
        default: shortid.generate()
    },
    orderId: {
        type: String,
        required: false
    },
    receipt_id: {
        type: String,
        required: false
    },
    paymentId: {
        type: String,
        required: false
    },
    patientDetails: {
        name: String,
        id: String,
        gender: String,
        phoneNumber: String,
        age: String,
    },
    time: {
        type: Date,
        required: true,
        default: Date.now()
    },
    appointmentTime: {
        type: String,
        required: true
    },
    doctor: {
        type: String,
        default: 'Dr Sanjay'
    },
    doctorId: {
        type: String, 
    },
    patientRemarks: String,
    fees: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('PatientAppointments', PatientAppointments)