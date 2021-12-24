const connectFacefacs = require("./db_facefacs")
const connectTokens = require("./db_tokens")

const getAll = async () =>
{
   try {
   
    const db = await connectTokens(); 
       
    const result = db.collection('tokensProf').find().toArray();
    db.close ()
    return result;

   } catch (error) {
    
       console.log(error)
   }
}

const add_Expression = async (id,turma,matricula,update,emotion,data) =>
{
    
    try {

    const db = await connectFacefacs();
   

    updateAluno_=""+[turma]+".alunos.$[]."+[data]+"."+[matricula]+"."+[emotion]
    
    

    const insert = await db.collection('expressions').updateOne(
        { "id":`${id}`}, {
            $push: {

            [updateAluno_]:update

            }
    }

    )
    result=db.collection('expressions').find().toArray(); 
    db.close ()
    return result
        
    } catch (error) {
        console.log("Turma não encontrada!") 
        console.log("Error:"+error)
        return false
    }

}


//adicionar token em disciplina
const addToken=async (turma,token) =>{ 
     
    const db = await connectTokens();   
    const result = db.collection('tokensProf').find().toArray();
    addToken_="tokens.$[]."+[turma] 
    const insert = await db.collection('tokensProf').updateOne(
        { "_id": "tokensId" }, {
            $push: {

            [addToken_]:{"token-aula":token}

            }
    }

    )
    
    db.close ()

    return result

}
//// verificar existencia de token daconst 
isTokenRoom=async (turma) =>{ 
     
    const db = await connectTokens();   
    const result = db.collection('tokensProf').find().toArray();
    db.close ()

    return result

}




const getReport=async(id_)=>{
    const db = await connectFacefacs();
    result=await db.collection('expressions').find({id:id_}).toArray();
    db.close ()
    return result


}


module.exports = { getAll,add_Expression,addToken,getReport,isTokenRoom}