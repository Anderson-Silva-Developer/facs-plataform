const connection = require('./db')


const getAll = async () =>
{
   try {   
    const db = await connection.DbConnectionToken.Get()
    const result = db.collection('tokensProf').find().toArray();
   
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
    const insert = await db.collection('expressions').updateOne(
        { "id":`${id}`}, {
            $push: {

            [updateAluno_]:update

            }
    }

    )
    result=db.collection('expressions').find().toArray(); 
    
    return result
        
    } catch (error) {
        console.log("Turma não encontrada!") 
        console.log("Error:"+error)
        return false
    }

}


//adicionar token em disciplina
const addToken=async (turma,token) =>{      
    const db = await connection.DbConnectionToken.Get()
    const result = db.collection('tokensProf').find().toArray();
    addToken_="tokens.$[]."+[turma] 
    const insert = await db.collection('tokensProf').updateOne(
        { "_id": "tokensId" }, {
            $push: {

            [addToken_]:{"token-aula":token}

            }
    }

    )
    
   

    return result

}
//// verificar existencia de token daconst 
const isTokenRoom=async (turma) =>{      
    const db = await connection.DbConnectionToken.Get()
    const result = db.collection('tokensProf').find().toArray();
   

    return result

}




const getReport=async(id_)=>{
    const db = await connection.DbConnectionFacs.Get()
    result=await db.collection('expressions').find({id:id_}).toArray();
   
    return result


}


module.exports = { getAll,add_Expression,addToken,getReport,isTokenRoom}