console.log("chatroom js loaded")
const socket = io()
if(myRole === ''){
    userinfo = 'guest';
    myRole = 'guest';
} else if(myRole == 'doctor'){
    userinfo = doctorName;
}
const roomid = roominfo;
// console.log("room id is: " + roomid)
// console.log("User name: " + username)
let username = userinfo;
const chatRoom = document.querySelector('.chat-box');
const sendButton = document.getElementById('add-chat-button');
const messageField = document.querySelector('.chat-input');

const videoCallButton = document.querySelector('.video-call-btn')


socket.emit('join-chatroom', roomid, username);

socket.on('join-chatroom', (conc, cnames) => {
    // console.log("connected to a room with " + conc);
    // console.log("Socketname: " + cnames)
})

sendButton.addEventListener('click' , () => {
    const msg = messageField.value;
    // console.log("message to be added: "+ msg);
    messageField.value = '';
    socket.emit('chatroom-message', msg, username, roomid);
    // addMessage(msg, sendername, time)
    chatRoom.scrollTop = document.getElementById('chat-box ul li:last-child').scrollHeight;
})

messageField.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        sendButton.click();
    }
});


socket.on('chatroom-message', (msg, sendername, time) => {
    addMessage(msg, sendername, time)
})

const addMessage = (msg, sendername, time) => {
    // console.log(sendername, username)
    if(sendername == username){
        chatRoom.innerHTML += `<li class="chat-right w-100 row d-flex justify-content-end float-left mb-5">
    <div class="row flex position-relative">
        <div class="column">
            <div class="chat-text bg-primary column" style="width: fit-content; padding: 5px; margin-right: 5px; border-radius: 10px;">
                <div class="chat-text text-white row mx-2" >
                    ${msg}
                </div>
                <div class="chat-hour float-right mx-2 text-muted text-xs row mb-1">
                    ${time}
                </div>
                
            </div>
        </div>
        <div class="column">
            <div class="chat-avatar">
                <img src="https://www.bootdey.com/img/Content/avatar/avatar4.png"
                    alt="Retail Admin"
                    style="width: 50px; height: 50px; border-radius: 50%;" >
                <div class="chat-name">${sendername}</div>
            </div>
        </div>
    </div>
</li>`
    } else {
        chatRoom.innerHTML += `<li class="chat-left w-100 row d-flex justify-content-start float-right mb-5">
        <div class="row flex position-relative">
            <div class="column">
                <div class="chat-avatar">
                    <img src="https://www.bootdey.com/img/Content/avatar/avatar2.png"
                        alt="Retail Admin" 
                        style="width: 50px; height: 50px; border-radius: 50%;" 
                        >
                    <div class="chat-name">${sendername}</div>
                </div>
            </div>
            <div class="column">
                <div class="chat-text bg-primary column" style="width: fit-content; padding: 5px; margin-left: 2px;  border-radius: 10px;">
                    <div class="chat-text text-white row mx-2">
                        ${msg}
                    </div>
                    <div class="chat-hour float-left mx-2 text-muted text-xs row mb-1">
                        ${time}
                    </div>
                </div>
                
            </div>
        </div>
    </li>`
    }
}




const addOldChats = async() => {
    console.log("Loading Chats on the screen");

    const data = await fetch(`/chat/get-user-chats-by-roomid/${roomid}`, {
        method: 'POST'
    }).then(t => t.json())
    .catch(e=>{
        alert("Error fetching old chats")
    })
    
    console.log(data)
    data.chats[0].messages.map(msg => {
        addMessage(msg.message, msg.username, msg.time)
    })

    chatRoom.scrollTop = chatRoom.scrollHeight;
}
