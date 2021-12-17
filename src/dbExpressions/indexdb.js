const {updateAluno,getAll,deleteAll,addTurma,newcollection,addToken} = require("./crud")


//  getAll_()  //ok
//    updateAluno_()  //ok
// deleteCollections() //ok
//  addTurma_( )//ok  
// addCollection()  
 async function getAll_(){
    result=await getAll()
    list=result[0]
    console.log(list)
    // turma=isToken(list,"hfhdjfdjfhdjfhjdfhdjf")
    // console.log("turma da busca "+turma)
    // turma="tcc-wpewepxcmmcxxaabbwwww"
    // addToken_(turma,"aaaajhgfjhgfjhgfjgfkkjgf")

     
}
function isToken(list,token_aula){
    turmaResult=""
    list1=(Object.keys(list["tokens"][0]))
    for(var i=0;i<list1.length;i++){
       turma=list1[i]
       list_token=list["tokens"][0][turma]
       for(var k=0;k<list_token.length;k++){
            if(list_token[k]["token-aula"]===token_aula){
                turmaResult=turma                
                break
            }
       }  
       
    }  
    return turmaResult


}
    
 async function updateAluno_(){
    
    emotion="angry"      
    matricula="20171cxcc0300" 
    turma="tcc-wpewepxcmmcxxaabb"
    data="10-09-29" 

    update={   
              
        "porcentagem": 1.11,
        "hora": 40,
        "minutos": 30,
        "segundos":36           
          
      }
   
     result=await updateAluno(turma,matricula,update,emotion,data);  

     console.log(result[0]!=null?result[0]:"")

}

async function deleteCollections(){
    result= await deleteAll();
    console.log(result==true?"delete ok":"error no delete")
}


async function addTurma_(){

    nomeTurma="tcc-wpewepxcmmcxxaabbwwww"  
    turno="noite"
    descricao="disciplina de TCC"
    datacreate="04-12-2021"
    turma={ 
        
        "turno":turno,
        "descricao":descricao,
        "alunos":[{}]
          
        
    }


    result= await addTurma(turma,nomeTurma);
    console.log(result)
}
async function addToken_(turma,token){
    await addToken(turma,token)
    
}
///
async function addCollection(){
    newcollection()

} 
async function validateToken(token){
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


module.exports = {validateToken}
    





