require('dotenv').config()

const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')

let moment = require('moment-timezone');
moment.tz.setDefault("Asia/Calcutta");


const mongoose = require('mongoose')
const path = require('path')

const corsOpts = {
    origin: '*',
    methods: [
        'GET',
        'POST'
    ]
}


const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(cors(corsOpts))
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(__dirname + '/public'));
app.use(logger('dev'))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"))


mongoose.connect(process.env.DATABASE_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    ()=> console.log("connected to db!")
)


// app.get('/', (req, res) => {
//     return res.send('hello world1')
// })
const { addMessageToDB, getPatientIdFromChatId } = require('./src/controllers/patientChatController')

let rooms = {};
let socketroom = {};
let socketname = {};
let micSocket = {};
let videoSocket = {};
let roomBoard = {};

io.on('connect', socket => {

    socket.on("join room", (roomid, username) => {

        socket.join(roomid);
        socketroom[socket.id] = roomid;
        socketname[socket.id] = username;
        micSocket[socket.id] = 'on';
        videoSocket[socket.id] = 'on';

        if (rooms[roomid] && rooms[roomid].length > 0) {
            rooms[roomid].push(socket.id);
            socket.to(roomid).emit('message', `${username} joined the room.`, 'Bot', moment().format(
                "h:mm a"
            ));
            io.to(socket.id).emit('join room', rooms[roomid].filter(pid => pid != socket.id), socketname, micSocket, videoSocket);
        }
        else {
            rooms[roomid] = [socket.id];
            io.to(socket.id).emit('join room', null, null, null, null);
        }

        io.to(roomid).emit('user count', rooms[roomid].length);

    });

    socket.on('action', msg => {
        if (msg == 'mute')
            micSocket[socket.id] = 'off';
        else if (msg == 'unmute')
            micSocket[socket.id] = 'on';
        else if (msg == 'videoon')
            videoSocket[socket.id] = 'on';
        else if (msg == 'videooff')
            videoSocket[socket.id] = 'off';

        socket.to(socketroom[socket.id]).emit('action', msg, socket.id);
    })

    socket.on('video-offer', (offer, sid) => {
        socket.to(sid).emit('video-offer', offer, socket.id, socketname[socket.id], micSocket[socket.id], videoSocket[socket.id]);
    })

    socket.on('video-answer', (answer, sid) => {
        socket.to(sid).emit('video-answer', answer, socket.id);
    })

    socket.on('new icecandidate', (candidate, sid) => {
        socket.to(sid).emit('new icecandidate', candidate, socket.id);
    })

    socket.on('message', (msg, username, roomid) => {
        io.to(roomid).emit('message', msg, username, moment().format(
            "h:mm a"
        ));
    })

    socket.on('disconnect', () => {
        if (!socketroom[socket.id]) return;
        socket.to(socketroom[socket.id]).emit('message', `${socketname[socket.id]} left the chat.`, `Bot`, moment().format(
            "h:mm a"
        ));
        socket.to(socketroom[socket.id]).emit('remove peer', socket.id);
        var index = rooms[socketroom[socket.id]].indexOf(socket.id);
        rooms[socketroom[socket.id]].splice(index, 1);
        io.to(socketroom[socket.id]).emit('user count', rooms[socketroom[socket.id]].length);
        delete socketroom[socket.id];

        //toDo: push socket.id out of rooms
    });

    //// Meeting Platform Finished!!!
    /// Now Chat Platform Sockets

    socket.on('join-notifications', (patientId) => {
        socket.join(patientId)
    })

    

    socket.on('join-chatroom', (roomid, username) => {
        socket.join(roomid);
        socketroom[socket.id] = roomid;
        socketname[socket.id] = username;
        if(rooms[roomid] && rooms[roomid].length > 0){
            rooms[roomid].push(socket.id);
            io.to(socket.id).emit('join-chatroom', rooms[roomid].filter(pid => pid != socket.id), socketname);
        } else {
            rooms[roomid] = [socket.id]
            io.to(socket.id).emit('join-chatroom', null, null)
        }
        
        io.to(roomid).emit('user count', rooms[roomid].length);
    })


    socket.on('chatroom-message', async(msg, username, roomid) => {
        await addMessageToDB(msg, username, roomid, moment().format("h:mm a"))
        io.to(roomid).emit('chatroom-message', msg, username, moment().format("h:mm a"));
        let meet = await getPatientIdFromChatId(roomid)
        
        io.to(meet.patientId.toString()).emit('chatroom-notif', msg, username, roomid)
        io.to(meet.doctorId).emit('chatroom-notif', msg, username, roomid)
        // io.emit('chatroom-notif', (msg))
    })

})


const Vroutes = require('./src/vroutes/index')
const PatientAuthRouter = require('./src/routes/patientAuth')
const PatientAppointmentRouter = require('./src/routes/patientAppointments')
const PatientPaymentRouter = require('./src/routes/payments')
const PatientChatRouter = require('./src/routes/patientChat')



app.use('/', Vroutes)
app.use('/', PatientAuthRouter)
app.use('/', PatientAppointmentRouter)
app.use('/', PatientPaymentRouter)
app.use('/chat', PatientChatRouter)


server.listen(process.env.PORT || 5000, () => {
    console.log(`View live at : http://localhost:${process.env.PORT}`)
})

