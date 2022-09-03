const Chats = require('./../src/patients/models/Chats')
const ChatRooms = require('./../src/patients/models/ChatRooms')



exports.addNewMessage = async(socket, chatRoomId, receiver, message) => {
    const userChatRoom = await ChatRooms.findOne({ userNum: socket.user.phone_num })
    if(userChatRoom){
        const y = userChatRoom.userChatRooms.filter(element =>{
            if(element.chatRoomID == chatRoomId){
                const userChats = await Chats.findOne({ chatroomId: chatRoomId })
                userChats.messages.push(message)
                const newMessages = userChats.messages
                const newUserChats = await Chats.findOneAndUpdate(
                    {
                        chatroomId: chatRoomId,
                    },
                    {
                        $set: {
                            messages: newMessages
                        }
                    }, 
                    {
                        new: true
                    }
                )
                return;
            }
        }) 
        const newUserChatRoom = new Chats({
            chatroomId: chatRoomID,
            messages: []
        })
        newUserChatRoom.messages.push(message);
        await newUserChatRoom.save()
        return;
    } else {
        const newUserChatRoom = new ChatRooms({
            userNum: socket.user.phone_num,
            userId: socket.user._id,
            userChatRooms: []
        })
        newUserChatRoom.userChatRoom.push({
            userChatRoomId: chatRoomId,
            receiver
        })
        await newUserChatRoom.save();
        this.addNewMessage(socket, chatRoomId, receiver, message)
    }
}