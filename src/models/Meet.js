const mongoose = require('mongoose')

const MeetSchema = new mongoose.Schema({
    chatid: {
        type: String,
        required: true,
        unique: true
    },
    meeting_id: {
        type: String,
        unique: true
    },
    appointmentId: {
        type: String,
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    patientName: {
        type: String,
        required: true
    },
    doctorId: {
        type: String,
        required: true,
    },
    doctorName: {
        type: String,
        default: 'Dr Sanjay'
    }
});


module.exports = mongoose.model('MeetSchema', MeetSchema);