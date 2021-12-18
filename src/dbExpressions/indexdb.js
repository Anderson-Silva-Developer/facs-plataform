const {getAll,addToken, add_Expression} = require("./crud")
const moment = require("moment")
 
 async function getClass(token){

    result=await getAll()
    list=result[0]
    result=isToken(list,token)

    return result
    
}
function isToken(list,token_aula){
    turmaResult=""
    id=""
    list1=(Object.keys(list["tokens"][0]))
    for(var i=0;i<list1.length;i++){
       turma=list1[i]
       list_token=list["tokens"][0][turma]
       for(var k=0;k<list_token.length;k++){
            if(list_token[k]["token-aula"]===token_aula){
                turmaResult=turma
                id=(list_token[0]["id"])                
                break
            }
       }  
       
    }  

    result=[]
    result.push(turmaResult)
    result.push(id)
    return result


}
    
 async function addExpression(emotion,matricula,token_aula,pct,h,m,s){    
   
    try {

     array=await getClass(token_aula)
     turma=array[0]
     id=array[1]
    
    let data = moment().format("DD/MM/YYYY");  

    update={   
              
        "porcentagem":pct,
        "hora": h,
        "minutos": m,
        "segundos":s          
          
      }  
      console.log(turma+" ************************** :"+id) 
      if(turma && id){
         

        result=await add_Expression(id,turma,matricula,update,emotion,data);  
        console.log(result[0]!=null?result[0]:"")
      }

     
        
    } catch (error) {
        console,log(error)
        
    }

}

//adicinar token da aula  na disciplina
async function addToken_(turma,token){
    result=await addToken(turma,token)
    console.log(result)
    
}

async function validateToken(token){//***/
    try {
        valid=false
        result=await getAll()
        list=(Object.keys(result[0]["tokens"][0]))
        for(var i=0;i<list.length;i++){            
            if(list[i]==token){
            console.log(token+" é valido")
            valid=true
            }
        
        }
        return valid

        
    } catch (error) {
        console.log(error)
        return false
        
    }
    


}


function addEmotion(array){

 for(var i=0;i<array["resultJson"].length;i++){
    var objeto = JSON.parse(array["resultJson"][i])
    try {
        addExpression(objeto.expression, objeto.matricula,objeto.token,objeto.porcentagem,objeto.hora, objeto.minutos,objeto.segundos)
    } catch (error) {
        console.log(error)
    }
    

 }   



}

module.exports = {validateToken,addToken_,addEmotion}
    





