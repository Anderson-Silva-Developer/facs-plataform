var getUserMedia
var myStream
var socket
const users = new Map()
const url= "/auth"

window.onbeforeunload = function() { return "Your work will be lost."; };
document.addEventListener('DOMContentLoaded', function() { 
    
   
 if(!localStorage.getItem("matricula_aluno") && !localStorage.getItem("inputTokenAluno")){ 
    window.location.replace("../index.html");

 }

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
        console.log(msg)
        localStorage.setItem("status","start")
        socket.emit('feedback_start',matricula)
        
     })
     socket.on('stop',function(msg){
        console.log(msg)
        localStorage.setItem("status","stop")
        
     })
     socket.on('getId',function(id){        
        socket.emit('postId',socket.matricula)        
        
     })
     socket.on('gravando',function(gravando){        
        localStorage.setItem("status",gravando=="on"?"start":"stop")     
        
     })
         
    return socket
}

async function enterInRoom () { 
    
    
    //
    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("../detections/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("../detections/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("../detections/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("../detections/models"),
      ]).then(Expression());   
  
    
    token = localStorage.getItem("inputTokenAluno")
    matricula=localStorage.getItem("matricula_aluno") 

        
    if (token && matricula) {         
        if(await isAuth(token)){
            socket = initServerConnection(token,matricula)
        }else{
            alert("token da aula inválido!")
            localStorage.clear();
            window.location.replace("../index.html"); 
        }
        
      
        
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
function isAuth(token){     
    const options = {
      url: url,
      method: 'GET',
      headers: {
        'x-access-token':token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }            
      
    };
    result = axios(options)
      .then(response => {         
        return response['data']['auth']
      })
    
    return result
  }
//
