function showLoading() {
    showPanel('loading')
    hidePanel('fail')
    hidePanel('connect')
    hidePanel('players')
}

function showFail() {
    hidePanel('loading')
    showPanel('fail')
    hidePanel('connect')
    hidePanel('players')
}

function showForm() {
    hidePanel('loading')
    hidePanel('fail')
    showPanel('connect')
    hidePanel('players')
    
}

function showPlayers() {
    hidePanel('loading')
    hidePanel('fail')
    hidePanel('connect')
    showPanel('players')
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
    document.getElementById('preview-player').srcObject = myStream
   

}
