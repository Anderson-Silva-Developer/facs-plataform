
var socket
document.addEventListener('DOMContentLoaded', function() {  

    if(!(localStorage.getItem("token_aula")) && !(localStorage.getItem("token_prof")) && !(localStorage.getItem("gravando"))){
        window.location.replace("./opcoes_professor.html"); 
    }


    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems,{});  
         
    document.getElementById('leave').addEventListener('click', leave) 
    document.getElementById('start').addEventListener('click',sendStart)
    document.getElementById('stop').addEventListener('click',sendStop)
    document.getElementById('send').addEventListener('click',sendReport)
       
    enterInRoom ()

},false);

function initServerConnection(token_aula) {

    var socket = io({
        query : {       

            token:token_aula,      
                        
        }
    })   
    
          
    socket.on('disconnect-user', function (data) {
        console.log("disconnect-user"+data.matricula)   
        removeAluno(data.matricula)    
       
    })
    
    socket.on('call',  function (data) {
       console.log("call"+data.matricula) 
       socket.emit('gravando',data.id,localStorage.getItem("gravando"))   
       
       addAluno(data.matricula)
    })

    socket.on('offer',  function (data) {
       console.log("offer")
    })

    socket.on('answer',  function (data) {
       console.log("answer")
    })

    socket.on('candidate', function (data) {
       console.log("candidate")
    })
    
    socket.on('connect', function () {  
       console.log("connect")
       statusAula(localStorage.getItem("gravando")=="on"?"on":"off")  
       socket.emit('getId',socket.id)

       

    })

    socket.on('connect_error', function(error) {
        console.log('Connection ERROR!')
        console.log(error)
        
    })
    socket.on('feedback', function(matricula) {
        console.log("start :"+matricula)       
        
    })
    socket.on('responseGetId', function(matricula) {
        addAluno(matricula)     
        
    })
    
    
    
    return socket
}
function enterInRoom () {

    
    token_prof=localStorage.getItem("token_prof")
    token_aula=localStorage.getItem("token_aula")
    status_aula=localStorage.getItem("gravando")

    if (token_prof && token_aula && status_aula) {       
        socket = initServerConnection(token_aula)        
    }

} 

function leave() {   
        
    localStorage.clear();
    window.location.replace("./opcoes_professor.html");   
    
}

function sendStart(){
    socket.emit('start',"start in:"+localStorage.getItem("token_aula"))
    statusAula("on")
}
function sendStop(){
    socket.emit('stop',"stop in:"+localStorage.getItem("token_aula"))
    statusAula("off")
    
}


function addAluno(matricula){
    try {
        var template = new DOMParser().parseFromString(`<a id="${matricula}"class="collection-item">${matricula}<span class="badge green"></span></a>`, 'text/html')
        var  list = template.body.childNodes[0]        
        document.getElementById('addAluno').appendChild(list)
        alunos=document.getElementById('addAluno')        
        document.getElementById('qtAlunos').innerHTML= alunos.childElementCount
        
    } catch (error) {
        console.log(error)
        
    }
      
    
}
function removeAluno(matricula){
    try {
        if(document.getElementById(`${matricula}`)){
            document.getElementById(`${matricula}`).remove()
            alunos=document.getElementById('addAluno')
            console.log(alunos.childElementCount)
            document.getElementById('qtAlunos').innerHTML= alunos.childElementCount
        }       
    } catch (error) {
        console.log(error)
    }
   
}
function statusAula(status){
    if(status==="on"){
        localStorage.setItem('gravando',"on");
        var template = new DOMParser().parseFromString(`<div id="onCam" class="btn-floating red pulse"><i class="material-icons">videocam</i></div>`, 'text/html')
        var  list = template.body.childNodes[0]        
        divStatus=document.getElementById('statusAula')
        divStatus.innerText = "";       
        divStatus.appendChild(list)
         
      console.log("camera ligada")
    }
    if(status==="off"){
        localStorage.setItem('gravando',"off");
        var template = new DOMParser().parseFromString(`<div id="offCam" class="btn-floating gray "><i class="material-icons">videocam_off</i></div>`, 'text/html')
        var  list = template.body.childNodes[0] 
        divStatus=document.getElementById('statusAula')
        divStatus.innerText = "";       
        divStatus.appendChild(list)

    }

}

function sendReport(){   
    token=localStorage.getItem("token_aula")  
    if(token){
    const options = {
        url:"/report",
        method: 'GET',
        headers: {
          'x-access-token':token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }            
        
      };
      result = axios(options)
        .then(response => {         
          console.log(response.status)
        })
        alert("Relatório em processo!!")
    }   
    
    
  }

