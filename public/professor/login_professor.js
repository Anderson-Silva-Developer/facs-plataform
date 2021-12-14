
document.addEventListener('DOMContentLoaded', function() {  
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems,{});  
    document.getElementById('loginForm').addEventListener('submit',pageOpcao)

    if((localStorage.getItem("token_aula")) && (localStorage.getItem("token_prof")) && (localStorage.getItem("matricula_professor"))){ 
        alert("já existe login em andamento!!")  
        window.location.replace("./sala_prof.html");
    }
},false);


function pageOpcao(e)
{
     
    e.preventDefault()
    var select = document.getElementById("select-user")
    var opUser = select.options[select.selectedIndex].value 
    
    
    
    if(opUser==1){ 
        try { 
               if(!(localStorage.getItem("token_aula")) && !(localStorage.getItem("token_prof")) && !(localStorage.getItem("matricula_professor"))){

                matricula=document.getElementById("matricula").value   
                var file_token_aula = document.getElementById("inputToken").files[0];
                var file_token_prof= document.getElementById("inputTokenProf").files[0];
                var fileread = new FileReader();
                var fileread1 = new FileReader();
                
                fileread.onload = function(e) {  
                                    
                  var content = e.target.result;
                  var intern = JSON.parse(content);  
                  localStorage.setItem('token_aula',intern.token);                                               

                };
                fileread1.onload =function(e) {  
                                     
                  var content = e.target.result;
                  var intern = JSON.parse(content);
                  if((localStorage.getItem("token_aula")) &&(!localStorage.getItem("matricula"))){
                    localStorage.setItem('token_prof',intern.token);  
                    localStorage.setItem('matricula_professor',matricula);
                    window.location.replace("./sala_prof.html");

                  }      
                  
                };
                
                fileread.readAsText(file_token_aula); 
                fileread1.readAsText(file_token_prof);
                

            
            }                  
      
        } catch (error) {
            console.log("erro")
        }
        
      
    }
    if(opUser==2){
        console.log("criar sala professor")
 
 
 
     }
}
function userOpcao(opcao){

if(opcao.value==2){
    try {
        document.getElementById("inputToken").required = false;
        document.getElementById("inputTokenProf").required=false;
        document.getElementById("matricula").required = false;
       
        hidePanel("optionProf")
    } catch (error) {
        console.log("========")
    }
           
}
if(opcao.value==1){
    showPanel("optionProf")
    document.getElementById("inputToken").required = true;
    document.getElementById("inputTokenProf").required=true;
    document.getElementById("matricula").required = true;

}


}
function hidePanel(name) {
    document.getElementById(name).classList.add("hide")
}
function showPanel(name) {

    document.getElementById(name).classList.remove("hide")


}
