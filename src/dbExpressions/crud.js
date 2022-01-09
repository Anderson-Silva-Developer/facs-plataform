const DbConnection = require('./db')

const getAll = async () =>
{
   try { 
    console.log("getAll: "+process.env.COLLECTION_NAME_TOKEN)      
        
   var db = await DbConnection.Get()    
   var  result = await db.collection(process.env.COLLECTION_NAME_TOKEN).find().toArray();  
   console.log("result :")  
   console.log(result)
   
    return result;

   } catch (error) {
    
       console.log(error)
       
   }
}

const add_Expression = async (id,turma,matricula,update,emotion,data) =>
{
    
    try {

    

    updateAluno_=""+[turma]+".alunos.$[]."+[data]+"."+[matricula]+"."+[emotion]
    
    
     var db = await DbConnection.Get()    
     await db.collection(process.env.COLLECTION_NAME_EXPRESSIONS).updateOne(
        { "id":`${id}`}, {
            $push: {

            [updateAluno_]:update

            }
    }

    )
            
    } catch (error) {
        console.log("Turma não encontrada!") 
        console.log("Error:"+error)
        return false
    }

}


//adicionar token em disciplina
const addToken=async (turma,token) =>{      
    var db = await DbConnection.Get()   
    var addToken_="tokens.$[]."+[turma]


    await db.collection(process.env.COLLECTION_NAME_TOKEN).updateOne(
        { "_id":turma}, {
            $push: {

            [addToken_]:{"token-aula":token}

            }
    }

    )
    
 
}


const getReport=async(id_)=>{
    var db = await DbConnection.Get()
    var result=await db.collection(process.env.COLLECTION_NAME_EXPRESSIONS).find({id:id_}).toArray();
   
    return result


}


module.exports = { getAll,add_Expression,addToken,getReport}