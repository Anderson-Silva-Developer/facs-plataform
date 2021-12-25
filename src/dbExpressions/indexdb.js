const {getAll,addToken, add_Expression,getReport,isTokenRoom} = require("./crud")
const moment = require("moment")
const mock=require("./result")
 
 async function getClass(token){

    result=await getAll()
    list=result[0]    
    result=isToken(list,token)

    return result
    
}
function isToken(list,token_aula){   
    
    try {        
   
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
    
} catch (error) {

    console.log(error)
        
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
 
      if(turma && id){         

        result=await add_Expression(id,turma,matricula,update,emotion,data);  
        
      }

     
        
    } catch (error) {
        console,log(error)
        
    }

}

//adicinar token da aula  na disciplina
async function addToken_(turma,token){
    result=await addToken(turma,token)
    
    
}

async function validateToken(token){//***/
    try {
        valid=false
        result=await getAll()
       
        list=(Object.keys(result[0]["tokens"][0]))
        for(var i=0;i<list.length;i++){  
                                 
            if(list[i]==token){            
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
    var objeto = JSON.parse(array["resultJson"][0])
    try {
        
        addExpression(objeto.expression, objeto.matricula,objeto.token,objeto.porcentagem,objeto.hora, objeto.minutos,objeto.segundos)
   
   
   
    } catch (error) {
        console.log(error)
    }   

 }   



}
async function get_Report(token)
{
    array=await getClass(token)
    turma=array[0]
    id=array[1]
    let data = moment().format("DD/MM/YYYY");     
    
    var qtdMatriculas=1
    var sumEmotions=0
    var sumDuvida=0
    var emotions=new Map();
    emotions.set("neutral",0) 
    emotions.set("happy",0) 
    emotions.set("sad",0) 
    emotions.set("angry",0)  
    emotions.set("fearful",0)
    emotions.set("disgusted",0)      
    emotions.set("surprised",0) 
    emotions.set("duvida",0)

    var infoTurma=new Map();

    infoTurma.set("data",data)
    infoTurma.set("turma",turma)

    var arrayMediaInd=[]    
    
    result = await getReport(id)
    // result=[mock]
      

    if (result)
    {
        array = result[0][turma]["alunos"]
        

        for (var i = 0; i < array.length; i++)
        {   
            listday=array[i][data]
            if(listday==null){
                
                break
            }           
            arrayExpressions = Object.keys(listday)       
            

            if (arrayExpressions)
            {  
                
                qtdMatriculas=arrayExpressions.length
                arrayExpressions.forEach(matricula =>
                {
                    
                    arrayemotions=(array[i][data][matricula])    
                    
                     //selecionar pela data
                     
                     var ob=createObject()
                     ob.matricula=matricula         

                    for (var [key, value] of emotions) {                    
                        
                        if(arrayemotions[key]){ 
                        
                        ob[key]=(arrayemotions[key].length)      
                         newvalue=((arrayemotions[key].length)+value)                                             
                         emotions.set(key,newvalue)  
                         
                         

                        }
                      }
                      arrayMediaInd.push(ob)
                                 

                });
            }

        }
        
        
    }
    
    
    for (var [key,value] of emotions) {        
        sumEmotions+=value 
          
    }
    
    //criar media individual
    
    for(var i=0;i<arrayMediaInd.length;i++){       

       for (var [key,value] of emotions) { 
            if(key!="duvida"){                
                if(value>0){
                newValue=((arrayMediaInd[i][key])*100)/value                
                arrayMediaInd[i][key]= parseFloat(newValue.toFixed(2))
                
                }

                
            }   

        }

    }
    
   
    for(var i=0;i<arrayMediaInd.length;i++){         
    
        valor =parseFloat(arrayMediaInd[i].sad)+parseFloat(arrayMediaInd[i].angry)
        arrayMediaInd[i].duvida =parseFloat(valor.toFixed(2))/2
        
    }
    
    
    //

    for (var [key,value] of emotions) { 

        var pc=(value*100)/sumEmotions
        emotions.set(key,pc.toFixed(2))
        
        if(key=="sad" || key=="angry"){            
            sumDuvida+=pc
        }      
               
    }
    

    emotions.set("duvida",sumDuvida.toFixed(2))


  

    dataEmotions=[]
    dataEmotions.push(emotions)
    dataEmotions.push(infoTurma)
    dataEmotions.push(arrayMediaInd)

   
    
    return dataEmotions

}

function createObject(){
    ob={
        matricula:"",
        neutral:0,
        happy:0,
        sad:0,
        angry:0,
        fearful:0,
        disgusted:0,
        surprised:0,
        duvida:0
    }
    return ob

}
//validar token professor e token aula
async function getisTokenRoom(token_prof,token_aula){
    
    try {
        valid=false
        result=await getAll()
       
        list=(Object.keys(result[0]["tokens"][0]))
        for(var i=0;i<list.length;i++){                                  
            if(list[i]==token_prof){

             tokensList=result[0]["tokens"][0][list[i]]
             resultToken =tokensList.filter(item=> item["token-aula"]==token_aula)    
             if(resultToken) {valid=true}  
           
            }
        
        }
       
        return valid

        
    } catch (error) {
        console.log(error)
        return false
        
    }

    

}

module.exports = {validateToken,addToken_,addEmotion,get_Report,getisTokenRoom}
    





