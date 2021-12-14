
var socket
document.addEventListener('DOMContentLoaded', function() {  
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems,{});  
         
    document.getElementById('leave').addEventListener('click', leave) 
    document.getElementById('start').addEventListener('click',sendStart)
    document.getElementById('stop').addEventListener('click',sendStop)
   
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

    })

    socket.on('connect_error', function(error) {
        console.log('Connection ERROR!')
        console.log(error)
        // leave()
    })
    socket.on('feedback', function(matricula) {
        console.log("start :"+matricula)
        
        
    })


    
    return socket
}
function enterInRoom () {

    matricula_professor=localStorage.getItem("matricula_professor")
    token_prof=localStorage.getItem("token_prof")
    token_aula=localStorage.getItem("token_aula")

    if (token_prof && token_aula && matricula_professor) {       
        socket = initServerConnection(token_aula)        
    }

} 

function leave() {   
        
    localStorage.clear();
    window.location.replace("./opcoes_professor.html");   
    
}

function sendStart(){
    socket.emit('start',"start in:"+localStorage.getItem("token_aula"))
}
function sendStop(){
    socket.emit('stop',"stop in:"+localStorage.getItem("token_aula"))
    
}


function addAluno(matricula){
      
    var template = new DOMParser().parseFromString(`<a id="${matricula}"class="collection-item">${matricula}<span class="new badge green">conectado</span></a>`, 'text/html')
    var  list = template.body.childNodes[0]        
    document.getElementById('addAluno').appendChild(list)
}
function removeAluno(matricula){
    document.getElementById(`${matricula}`).remove()
}

