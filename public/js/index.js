var getUserMedia
var myStream
var socket
const users = new Map()
const parts=[]
const url= "/data"

window.onbeforeunload = function() { return "Your work will be lost."; };
document.addEventListener('DOMContentLoaded', function() {  
    if(!localStorage.getItem("status")){
        localStorage.setItem("status","pause")
      
    }
    
   
document.getElementById('leave').addEventListener('click', leave) 

    navigator.mediaDevices.getUserMedia({ video: {
        height: 240,
        width: 320
    }, audio: false })
    .then(function (stream) {
        myStream = stream 
       
        enterInRoom()   
          
         
       
    }).catch(function (err) {
        console.log(err)
        showFail()
       
    })
}, false)

function initServerConnection(token,matricula) {

    var socket = io({
        query : {    

            token:token,
            matricula:matricula      
                        
        }
    })   
    socket.matricula=matricula
          
    socket.on('disconnect-user', function (data) {
               
        var user = users.get(data.id)
        if(user) {
            users.delete(data.id)
            user.selfDestroy()
        }
    })
    
    socket.on('call',  function (data) {
        let user = new User(data.id)
        user.pc = createPeer(user)
        users.set(data.id, user)

        createOffer(user, socket)
    })

    socket.on('offer',  function (data) {
        var user = users.get(data.id)
        if (user) {
            answerPeer(user, data.offer, socket)
        } else {
            let user = new User(data.id)
            user.pc = createPeer(user)
            users.set(data.id, user)
            answerPeer(user, data.offer, socket)
        }
    })

    socket.on('answer',  function (data) {
        var user = users.get(data.id)
        if(user) {
            user.pc.setRemoteDescription(data.answer)
        }
    })

    socket.on('candidate', function (data) {
        var user = users.get(data.id)
        if (user) {
            user.pc.addIceCandidate(data.candidate)
        } else {
            let user = new User(data.id)
            user.pc = createPeer(user)
            user.pc.addIceCandidate(data.candidate)
            users.set(data.id, user)
        }
    })
    
    socket.on('connect', function () {
        
        showConnect()

    })

    socket.on('connect_error', function(error) {
        console.log('Connection ERROR!')
        console.log(error)
        leave()
    })
    socket.on('start',function(msg){
        console.log("mansagem recebida "+msg)
        localStorage.setItem("status","start")
        socket.emit('feedback_start',matricula)
        
     })
     socket.on('stop',function(msg){
        console.log("mansagem recebida "+msg)
        localStorage.setItem("status","stop")
        
     })
     socket.on('getId',function(id){        
        socket.emit('postId',socket.matricula)        
        
     })
         
    return socket
}

function enterInRoom () { 
    
    
    //
    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("../detections/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("../detections/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("../detections/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("../detections/models"),
      ]).then(Expression());   

    //

   
    ///gravar video
    const mediaRecorder=new MediaRecorder(myStream)
    mediaRecorder.start(10000)
    mediaRecorder.ondataavailable=function(e){
        parts.push(e.data)
        const blob=new Blob(parts,{type:"video/webm"})
        // save(blob)        

    }
    
    //pegar dados do form

        
    token = localStorage.getItem("inputTokenAluno")
    matricula=localStorage.getItem("matricula_aluno")        
    
    if (token && matricula) {       
        socket = initServerConnection(token,matricula)
        
    }
}


function leave() {    
    socket.close()
    for(var user of users.values()) {
        user.selfDestroy()
    }
    users.clear()  
    
    localStorage.clear();
    window.location.replace("../index.html");   
    
}

//
function save(blob){  
   
    const options = {
      url: url,
      method: 'POST',
      headers: {
        'name':"facefacs",
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data; boundary=${data._boundary}'
      },
      data:blob,        
      
    };
    axios(options)
      .then(response => {
        console.log(response.status);
      });
      
  
  }
//
