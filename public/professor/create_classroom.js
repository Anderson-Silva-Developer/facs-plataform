
document.addEventListener('DOMContentLoaded', function() {  
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems,{});  
    document.getElementById('loginForm').addEventListener('submit',getToken)

},false);

function getToken(e){
    e.preventDefault()
    
        try { 
             

                matricula=document.getElementById("matricula").value  
                              
                var file_token_prof= document.getElementById("inputTokenProf").files[0];
                var fileread = new FileReader();
                               
               
                 fileread.onload =async function(e) {                                       
                  var content = e.target.result;
                  var intern = JSON.parse(content);                              
                 
                 getTokenAula(matricula,intern.token)                           
                  
                };                
                 
                fileread.readAsText(file_token_prof);
               
               
                         
      
        } catch (error) {
            console.log("erro: "+error)
        }
     
}
function getTokenAula(matricula,token){ 
       
    const options = {
        url: "/getToken",
        method: 'POST',       
        data:{
            matricula:matricula,
            token:token
        },        
        
      };
    axios(options)
      .then(response => {        
        let data ={"token":response['data']['token']};        
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href",     dataStr     );
        dlAnchorElem.setAttribute("download", "token_aula.json");
        dlAnchorElem.click();
        window.location.replace("./opcoes_professor.html"); 
               
      });
      
  
  }

