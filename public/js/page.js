function showLoading() {
    showPanel('loading')
    hidePanel('fail')
    hidePanel('connect')
    
}

function showFail() {
    hidePanel('loading')
    showPanel('fail')
    hidePanel('connect')
    
}

function showForm() {
    hidePanel('loading')
    hidePanel('fail')
    showPanel('connect')   
    hidePanel('login')
    
}

function showLogin(){
    hidePanel('loading')
    hidePanel('fail')
    hidePanel('connect')    
    showPanel('login')

}

function showConnect(){   
    showPanel("div-player")
    hidePanel('roomForm')
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
