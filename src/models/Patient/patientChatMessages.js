const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema({
    chatroomId: {
        type: String,
        auto: true,
        required: true,
        unique: true
    },
    messages: [{
        username: {
            type: String,
            required: true,
        },
        messageType: {
            type: String,
            default: 'text'
        },
        time: {
            type: String,
            required: false
        },
        message: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }] 
});


module.exports = mongoose.model('ChatSchema', ChatSchema)