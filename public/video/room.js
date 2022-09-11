const socket = io();
const myvideo = document.querySelector("#vd1");
const roomid = roomInfo
let username;
const chatRoom = document.querySelector('.chat-cont');
const sendButton = document.querySelector('.chat-send');
const messageField = document.querySelector('.chat-input');
const videoContainer = document.querySelector('#vcont');
const overlayContainer = document.querySelector('#overlay')
const continueButt = document.querySelector('.continue-name');
const nameField = document.querySelector('#name-field');
const videoButt = document.querySelector('.novideo');
const chatButt = document.querySelector('.chatBtn')
const audioButt = document.querySelector('.audio');
const cutCall = document.querySelector('.cutcall');
const chatSection = document.getElementById('right-cont')
const videoSection = document.getElementById('left-cont')
const chatCloseBut = document.getElementById('chatCloseBtn')


let remoteVideo = document.querySelector('#vd2')
let remoteMuteIcon = document.querySelector('#muteicon-2')
let remoteVideoIcon = document.querySelector('#videooff-2')
let remoteName = document.querySelector('#remotename')

let numberOfPeople = 1;
let MediaStreams = [];


//
let globalStream = undefined;
let remoteStream = undefined;

let videoAllowed = 1;
let audioAllowed = 1;

let micInfo = {};
let videoInfo = {};

let videoTrackReceived = {};

let mymuteicon = document.querySelector("#mymuteicon");
mymuteicon.style.visibility = 'hidden';

let myvideooff = document.querySelector("#myvideooff");
myvideooff.style.visibility = 'hidden';

const configuration = { iceServers: [{ urls: "stun:stun.stunprotocol.org" }] }

const mediaConstraints = { video: true, audio: true };

let connections = {};
let cName = {};
let audioTrackSent = {};
let videoTrackSent = {};

let mystream, myscreenshare;



continueButt.addEventListener('click', () => {
    if (nameField.value == '') return;
    username = nameField.value;
    overlayContainer.style.visibility = 'hidden';
    document.querySelector("#myname").innerHTML = `${username} (You)`;
    socket.emit("join room", roomid, username);
    openUserMedia()
})

nameField.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        continueButt.click();
    }
});

socket.on('user count', count => {
})

let peerConnection;

function handleGetUserMediaError(e) {
    switch (e.name) {
        case "NotFoundError":
            alert("Unable to open your call because no camera and/or microphone" +
                "were found.");
            break;
        case "SecurityError":
        case "PermissionDeniedError":
            break;
        default:
            alert("Error opening your camera and/or microphone: " + e.message);
            break;
    }
}


function reportError(e) {
    console.log(e);
    return;
}


function startCall() {
    console.log("starting the call!")
        if(globalStream){
            console.log("Using global Stream")
            myvideo.srcObject = globalStream
            myvideo.muted = true;

            globalStream.getTracks().forEach(track => {
                for(let key in connections) {
                    connections[key].addTrack(track, globalStream);
                    if(track.kind == 'audio')
                        audioTrackSent[key] = track;
                    else
                        videoTrackSent[key] = track; 
                }
            })
        } else {
            console.log("Creating global Stream")
            navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then(localStream => {
                globalStream = localStream
                myvideo.srcObject = localStream;
                myvideo.muted = true;
                
                localStream.getTracks().forEach(track => {
                    for (let key in connections) {
                        connections[key].addTrack(track, localStream);
                        if (track.kind === 'audio')
                            audioTrackSent[key] = track;
                        else
                            videoTrackSent[key] = track;
                    }
                })
            })
            .catch(handleGetUserMediaError);
      
        
    }
    // }
    

}

function handleVideoOffer(offer, sid, cname, micinf, vidinf) {
    console.log("handle Video Offer")
    
    cName[sid] = cname;
    // console.log('video offered recevied');
    micInfo[sid] = micinf;
    videoInfo[sid] = vidinf;
    connections[sid] = new RTCPeerConnection(configuration);

    connections[sid].onicecandidate = function (event) {
        if (event.candidate) {
            // console.log('icecandidate fired');
            socket.emit('new icecandidate', event.candidate, sid);
        }
    };

    
    connections[sid].ontrack = function (event) {
        console.log("On track from " + sid + " sid")
        if (!document.getElementById(sid)) {
            // console.log('track event fired')
            // let vidCont = document.createElement('div');
            // let newvideo = document.createElement('video');
            // let name = document.createElement('div');
            // let muteIcon = document.createElement('div');
            // let videoOff = document.createElement('div');
            // videoOff.classList.add('video-off');
            // muteIcon.classList.add('mute-icon');
            // name.classList.add('nametag');
            // name.innerHTML = `${cName[sid]}`;
            // vidCont.id = sid;
            // muteIcon.id = `mute${sid}`;
            // videoOff.id = `vidoff${sid}`;
            // muteIcon.innerHTML = `<i class="fas fa-microphone-slash"></i>`;
            // videoOff.innerHTML = 'Video Off'
            // vidCont.classList.add('video-box');
            // newvideo.classList.add('video-frame');
            // newvideo.autoplay = true;
            // newvideo.playsinline = true;
            // newvideo.id = `video${sid}`;
            remoteVideo.srcObject = event.streams[0];
            remoteName.innerHTML = `${cName[sid]}`;

            if (micInfo[sid] == 'on')
                remoteMuteIcon.style.visibility = 'hidden';
            else
                remoteMuteIcon.style.visibility = 'visible';

            if (videoInfo[sid] == 'on')
                remoteVideoIcon.style.visibility = 'hidden';
            else
                remoteVideoIcon.style.visibility = 'visible';

            // vidCont.appendChild(newvideo);
            // vidCont.appendChild(name);
            // vidCont.appendChild(muteIcon);
            // vidCont.appendChild(videoOff);

            // videoContainer.appendChild(vidCont);

        }


    };

    connections[sid].onremovetrack = function (event) {
        console.log("Removing sid: " + sid)
        if (document.getElementById(sid)) {
            document.getElementById(sid).remove();
            // console.log('removed a track');
        }
    };

    connections[sid].onnegotiationneeded = function () {
        connections[sid].createOffer()
            .then(function (offer) {
                console.log("creating offer")
                return connections[sid].setLocalDescription(offer);
            })
            .then(function () {

                socket.emit('video-offer', connections[sid].localDescription, sid);

            })
            .catch(reportError);
    };

    let desc = new RTCSessionDescription(offer);

    connections[sid].setRemoteDescription(desc)
        .then(() => { 
            if(globalStream){
                console.log("Using global Stream in setRemoteDescription")
                return globalStream;
            }
            //  else {
            //     console.log("Creating global Stream in setRemoteDescription")
            //     return navigator.mediaDevices.getUserMedia(mediaConstraints) 
            // }
        })
        .then((localStream) => {
            globalStream.getTracks().forEach(track => {
                connections[sid].addTrack(track, globalStream);
                // console.log('added local stream to peer')
                if (track.kind === 'audio') {
                    audioTrackSent[sid] = track;
                    if (!audioAllowed)
                        audioTrackSent[sid].enabled = false;
                }
                else {
                    videoTrackSent[sid] = track;
                    if (!videoAllowed)
                        videoTrackSent[sid].enabled = false
                }
            })

        })
        .then(() => {
            return connections[sid].createAnswer();
        })
        .then(answer => {
            return connections[sid].setLocalDescription(answer);
        })
        .then(() => {
            socket.emit('video-answer', connections[sid].localDescription, sid);
        })
        .catch(handleGetUserMediaError);


}

function handleNewIceCandidate(candidate, sid) {
    // console.log('new candidate recieved')
    var newcandidate = new RTCIceCandidate(candidate);

    connections[sid].addIceCandidate(newcandidate)
        .catch(reportError);
}

function handleVideoAnswer(answer, sid) {
    // console.log('answered the offer')
    const ans = new RTCSessionDescription(answer);
    connections[sid].setRemoteDescription(ans);
}


socket.on('video-offer', handleVideoOffer);

socket.on('new icecandidate', handleNewIceCandidate);

socket.on('video-answer', handleVideoAnswer);


socket.on('join room', async (conc, cnames, micinfo, videoinfo) => {
    // socket.emit('getCanvas');
    if (cnames)
        cName = cnames;

    if (micinfo)
        micInfo = micinfo;

    if (videoinfo)
        videoInfo = videoinfo;
    
    console.log("Conc Value: " + conc);
    if (conc) {
        await conc.forEach(sid => {
            if(numberOfPeople == 3) {
                document.location='/';
            }
            numberOfPeople+=1;
            console.log("Number of People: " + numberOfPeople)
            connections[sid] = new RTCPeerConnection(configuration);

            connections[sid].onicecandidate = function (event) {
                if (event.candidate) {
                    // console.log('icecandidate fired');
                    socket.emit('new icecandidate', event.candidate, sid);
                }
            };

            connections[sid].ontrack = function (event) {
                console.log("On track from conc for sid: "+ sid)
                if (!document.getElementById(sid)) {
                    remoteVideo.srcObject = event.streams[0];
                    remoteName.innerHTML = `${cName[sid]}`;

                    if (micInfo[sid] == 'on')
                        remoteMuteIcon.style.visibility = 'hidden';
                    else
                        remoteMuteIcon.style.visibility = 'visible';

                    if (videoInfo[sid] == 'on')
                        remoteVideoIcon.style.visibility = 'hidden';
                    else
                        remoteVideoIcon.style.visibility = 'visible';


                }

            };

            connections[sid].onremovetrack = function (event) {
                if (document.getElementById(sid)) {
                    document.getElementById(sid).remove();
                }
                removeRemote()
            }

            connections[sid].onnegotiationneeded = function () {

                connections[sid].createOffer()
                    .then(function (offer) {
                        return connections[sid].setLocalDescription(offer);
                    })
                    .then(function () {

                        socket.emit('video-offer', connections[sid].localDescription, sid);

                    })
                    .catch(reportError);
            };

        });


    }
})

socket.on('remove peer', sid => {
    if (document.getElementById(sid)) {
        document.getElementById(sid).remove();
    }
    removeRemote(sid)
    delete connections[sid];
})

sendButton.addEventListener('click', () => {
    const msg = messageField.value;
    messageField.value = '';
    socket.emit('message', msg, username, roomid);
})

messageField.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        sendButton.click();
    }
});

socket.on('message', (msg, sendername, time) => {
    chatRoom.scrollTop = chatRoom.scrollHeight;
    chatRoom.innerHTML += `<div class="message">
    <div class="info">
        <div class="username">${sendername}</div>
        <div class="time">${time}</div>
    </div>
    <div class="content">
        ${msg}
    </div>
</div>`
});

videoButt.addEventListener('click', () => {

    if (videoAllowed) {
        for (let key in videoTrackSent) {
            videoTrackSent[key].enabled = false;
        }
        videoButt.innerHTML = `<i class="fas fa-video-slash"></i>`;
        videoAllowed = 0;
        videoButt.style.backgroundColor = "#b12c2c";

        if (globalStream) {
            globalStream.getTracks().forEach(track => {
                if (track.kind === 'video') {
                    track.enabled = false;
                }
            })
        }

        myvideooff.style.visibility = 'visible';

        socket.emit('action', 'videooff');
    }
    else {
        for (let key in videoTrackSent) {
            videoTrackSent[key].enabled = true;
        }
        videoButt.innerHTML = `<i class="fas fa-video"></i>`;
        videoAllowed = 1;
        videoButt.style.backgroundColor = "#4ECCA3";
        if (globalStream) {
            globalStream.getTracks().forEach(track => {
                if (track.kind === 'video')
                    track.enabled = true;
            })
        }


        myvideooff.style.visibility = 'hidden';

        socket.emit('action', 'videoon');
    }
})

chatButt.addEventListener('click', () => {
    console.log("doing it")
    chatSection.style.display = "block";
    videoSection.style.display = 'none'
    
})

chatCloseBut.addEventListener('click', () =>{
    chatSection.style.display = "none";
    videoSection.style.display = 'block'
})


audioButt.addEventListener('click', () => {

    if (audioAllowed) {
        for (let key in audioTrackSent) {
            audioTrackSent[key].enabled = false;
        }
        audioButt.innerHTML = `<i class="fas fa-microphone-slash"></i>`;
        audioAllowed = 0;
        audioButt.style.backgroundColor = "#b12c2c";
        if (globalStream) {
            globalStream.getTracks().forEach(track => {
            if (track.kind === 'audio')
                track.enabled = false;
            })
        }

        mymuteicon.style.visibility = 'visible';

        socket.emit('action', 'mute');
    }
    else {
        for (let key in audioTrackSent) {
            audioTrackSent[key].enabled = true;
        }
        audioButt.innerHTML = `<i class="fas fa-microphone"></i>`;
        audioAllowed = 1;
        audioButt.style.backgroundColor = "#4ECCA3";
        if (globalStream) {
            globalStream.getTracks().forEach(track => {
                if (track.kind === 'audio')
                    track.enabled = true;
            })
        }

        mymuteicon.style.visibility = 'hidden';

        socket.emit('action', 'unmute');
    }
})

socket.on('action', (msg, sid) => {
    if (msg == 'mute') {
        remoteMuteIcon.style.visibility = 'visible';
        micInfo[sid] = 'off';
    }
    else if (msg == 'unmute') {
        remoteMuteIcon.style.visibility = 'hidden';
        micInfo[sid] = 'on';
    }
    else if (msg == 'videooff') {
        videoInfo[sid] = 'off';
        remoteVideoIcon.style.visibility = 'visible';
    }
    else if (msg == 'videoon') {
        videoInfo[sid] = 'on';
        remoteVideoIcon.style.visibility = 'hidden';
    }
})


cutCall.addEventListener('click', () => {
    console.log()
    location.href = '/appointments';
})



const removeRemote = (sid) => {
    remoteMuteIcon.style.visibility = 'visible';
    micInfo[sid] = 'off';
    remoteVideoIcon.style.visibility = 'visible';
    videoInfo[sid] = 'off';
    remoteName.innerHTML = 'Left The Meet'
    let emptyStream = new MediaStream();
    remoteVideo.srcObject = emptyStream;
}


const openUserMedia = () => {
    navigator.mediaDevices.getUserMedia(mediaConstraints)
        .then(localStream => {
            globalStream = localStream
            myvideo.srcObject = localStream;
            myvideo.muted = true;

            localStream.getTracks().forEach(track => {
                for (let key in connections) {
                    connections[key].addTrack(track, localStream);
                    if (track.kind === 'audio')
                        audioTrackSent[key] = track;
                    else
                        videoTrackSent[key] = track;
                }
            })
        })
        .catch(handleGetUserMediaError);
}