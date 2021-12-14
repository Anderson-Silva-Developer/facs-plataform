
function showFail() {
   
    showPanel('fail')
    hidePanel("connect")
    
    
}


function showConnect(){ 
    hidePanel('fail') 
    showPanel("connect") 
    showPanel("div-player")    
    custom("div-player","s12")
    
    
}

function custom(name,custom){
    document.getElementById(name).classList.add(custom)
}

function hidePanel(name) {
    document.getElementById(name).classList.add("hide")
}

function showPanel(name) {
    document.getElementById(name).classList.remove("hide")


}
//adicionar user
function setLocalPlayerStream() {

    
    document.getElementById('local-player').srcObject = myStream
    
   

}
