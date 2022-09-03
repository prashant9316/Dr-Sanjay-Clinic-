const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true,
        length: 6
    },
    expiryAt: {
        type: Date
    }
});

OtpSchema.pre('save', 
    async function(next) {
        const minutesToAdd = 5;
        const currentTime = new Date();
        const futureTime = new Date(currentTime.getTime() + minutesToAdd*60000)
        this.expiryAt = futureTime;
    })

module.exports = mongoose.model('userOtp', OtpSchema);