var getUserMedia
var myStream
var socket
const users = new Map()
const parts=[]
const url= "/data"

var exitpage=true

window.onbeforeunload = function(event) {           
         
         if(exitpage){             
          return "page"
         }else{
           exitpage=true           
         }     
               
 }

document.addEventListener('DOMContentLoaded', function() {  
        
    //opção de usuário
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems,{});        
    //

    document.getElementById('roomForm').addEventListener('submit', enterInRoom)    
    document.getElementById('leave').addEventListener('click', leave)

    navigator.mediaDevices.getUserMedia({ video: {
        height: 240,
        width: 320
    }, audio: false })
    .then(function (stream) {
        myStream = stream
        setLocalPlayerStream()
        showForm()
    }).catch(function (err) {
        console.log(err)
        showFail()
    })
}, false)

function initServerConnection(room) {
    var socket = io({
        query : {
            room: room
        }
    })

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
        showPlayers()
    })

    socket.on('connect_error', function(error) {
        console.log('Connection ERROR!')
        console.log(error)
        leave()
    })
    
    return socket
}

function enterInRoom (e) { 
   
    ///gravar video
    const mediaRecorder=new MediaRecorder(myStream)
    mediaRecorder.start(10000)
    mediaRecorder.ondataavailable=function(e){
        parts.push(e.data)
        const blob=new Blob(parts,{type:"video/webm"})
        save(blob)        

    }
    
    //pegar dados do form
    e.preventDefault()
    room = document.getElementById('inputRoom').value
    var select = document.getElementById("select-user")
    var value = select.options[select.selectedIndex].value  
    var element = document.getElementById('typeuser')
    element.innerHTML =(value==1?"profesor(a)":"aluno(a)")      
    
    if (room) {
        socket = initServerConnection(room)
    }
}


function leave() {
    exitpage=false
    location.reload()
    socket.close()
    for(var user of users.values()) {
        user.selfDestroy()
    }
    users.clear()      
    showForm()   
    
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
