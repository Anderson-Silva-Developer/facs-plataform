const connection = require('./db')


const getAll = async () =>
{
   try {   
    const db = await connection.DbConnectionFacs.Get()
    const result = db.collection(process.env.COLLECTION_NAME_TOKEN).find().toArray();
   
    return result;

   } catch (error) {
    
       console.log(error)
   }
}

const add_Expression = async (id,turma,matricula,update,emotion,data) =>
{
    
    try {

    

    updateAluno_=""+[turma]+".alunos.$[]."+[data]+"."+[matricula]+"."+[emotion]
    
    
    const db = await connection.DbConnectionFacs.Get()
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
    const db = await connection.DbConnectionFacs.Get()   
    addToken_="tokens.$[]."+[turma] 
    const insert = await db.collection(process.env.COLLECTION_NAME_TOKEN).updateOne(
        { "_id": "tokensId" }, {
            $push: {

            [addToken_]:{"token-aula":token}

            }
    }

    )
    
 
}
//// verificar existencia de token daconst 
const isTokenRoom=async (turma) =>{      
    const db = await connection.DbConnectionFacs.Get()
    const result = db.collection(process.env.COLLECTION_NAME_TOKEN).find().toArray();
   

    return result

}




const getReport=async(id_)=>{
    const db = await connection.DbConnectionFacs.Get()
    result=await db.collection(process.env.COLLECTION_NAME_EXPRESSIONS).find({id:id_}).toArray();
   
    return result


}


module.exports = { getAll,add_Expression,addToken,getReport,isTokenRoom}