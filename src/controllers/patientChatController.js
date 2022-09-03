const MeetDB = require('./../models/Meet')
const Chats = require('./../models/Patient/patientChatMessages')

function uuidv4() {
    return 'xxyxyxxyxxy'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const getPatientIdFromChatId = async(roomid) => {
    const meet = await MeetDB.findOne({ chatid: roomid })
    return meet
}

const createChat = async(req) => {
    try {
        console.log("Creating Chat Room")
        console.log(req.appointment)
        const meeting_id = uuidv4()
        const chat_id = uuidv4()
        const newUserChat = new MeetDB({
            chatid: chat_id,
            meeting_id,
            patientId: req.appointment.patientDetails.id,
            doctorId: 'DSK',
            appointmentId: req.appointment.appointmentId,
            doctorName: 'Dr Sanjay',
            patientName: req.appointment.patientDetails.name
        })
        const savedUserChat = await newUserChat.save();
        req.body.userChat = savedUserChat
        console.log(savedUserChat)
    } catch (error) {
        console.log("Error occured!")
        console.log(error)
        req.error = error
    }
    return req;
}



// To be worked on
const addMessageToDB = async(msg, username, roomid, time) => {
    try {
        const chatRoom = await Chats.findOne({
            chatroomId: roomid
        });
        if(!chatRoom){
            const newChatRoom = new Chats({
                chatroomId: roomid
            })
            newChatRoom.messages.push({
                username: username,
                message: msg,
                time: time
            })
            await newChatRoom.save()
            return true
        } else {
            let messages = chatRoom.messages
            messages.push({
                username,
                message: msg,
                time
            })
            const updateChatRoom = await Chats.findOneAndUpdate(
                {
                    chatroomId: roomid
                },
                {
                    $set: {
                        messages: messages
                    }
                },
                {
                    new: true
                }
            )
            return true
        }
    } catch (e) {
        console.log(e)
        return false
    }
}


const getChatIdByAppointmentId = async(req, res) => {
    try {
        const appointmentId = req.params.id;
        const chatInfo = await MeetDB.findOne({ appointmentId });
        return res.status(200).json({
            chatInfo, 
            code: 200
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error,
            code: 500
        })
    }
}


const getChatInfoByChatId = async(req) => {
    try {
        const chatInfo = await MeetDB.findOne({ chatid: req.params.id })
        req.data = chatInfo
    } catch (error) {
        req.error = error;
    }
    return req;
}



const getUserChatById = async(req, res) => {
    try {
        const chatsById = await Chats.find({ chatroomId: req.params.id })
        if(chatsById == null){
            req.error = 'No Chats found!';
            throw "Chat Not Found!"
        }
        console.log(chatsById)
        return res.json({
            status: 200,
            code: 200,
            chats: chatsById
        })
    } catch (error) {
        return res.status(500).json({
            code: 500,
            chats: [],
            error
        })
    }
}


module.exports = {
    addMessageToDB: addMessageToDB,
    createChat: createChat,
    getChatIdByAppointmentId: getChatIdByAppointmentId,
    getUserChatById: getUserChatById,
    getChatInfoByChatId: getChatInfoByChatId,
    getPatientIdFromChatId: getPatientIdFromChatId
}