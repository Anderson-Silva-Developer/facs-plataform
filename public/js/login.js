
document.addEventListener('DOMContentLoaded', function() { 
   
  const inputMatricula=document.getElementById("matricula")
  inputMatricula.addEventListener("paste",function(e){
    e.preventDefault()
  }) 

     var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems,{});      
    document.getElementById('loginForm').addEventListener('submit',pageOpcao)
    if(localStorage.getItem("matricula_aluno") && localStorage.getItem("inputTokenAluno")){   
                 
        alert("já existe login em andamento!!")       
        window.location.replace("../aluno/sala_aluno.html");
    }


},false);


function pageOpcao(e)
{
     
    e.preventDefault()
    var select = document.getElementById("select-user")
    var opUser = select.options[select.selectedIndex].value 
    
    
    if(opUser==1){

        window.location.replace("../professor/opcoes_professor.html");


    }
    if(opUser==2){ 
        try { 
               if(!(localStorage.getItem("matricula_aluno")) && !(localStorage.getItem("inputTokenAluno"))){

                matricula=document.getElementById("matricula").value   
                var file_to_read = document.getElementById("inputToken").files[0];
                var fileread = new FileReader();
                
                fileread.onload = function(e) {
                  var content = e.target.result;
                  var intern = JSON.parse(content);
                  console.log(intern.token)
                  localStorage.setItem('inputTokenAluno',intern.token);
                  localStorage.setItem('matricula_aluno',matricula);                   
                  window.location.replace("../aluno/sala_aluno.html");
                      

                };
                fileread.readAsText(file_to_read); 
                
            }      
             
        } catch (error) {
            console.log("Erro: "+ error)
        }
        
      
    }
}
function userOpcao(opcao){

if(opcao.value==0 || opcao.value==1){
    try {
        hidePanel("optionAluno")
    } catch (error) {
        console.log("========")
    }
           
}
if(opcao.value==2){
    showPanel("optionAluno")
    document.getElementById("inputToken").required = true;
    document.getElementById("matricula").required = true;

}
if(opcao.value==0 || opcao.value==1){
    document.getElementById("inputToken").required = false;
    document.getElementById("matricula").required = false;
  

}


}
function hidePanel(name) {
    document.getElementById(name).classList.add("hide")
}
function showPanel(name) {

    document.getElementById(name).classList.remove("hide")


}
