const connectFacefacs = require("./db_facefacs")
const connectTokens = require("./db_tokens")


const getAll = async () =>
{
   try {
    const db = await connectTokens();    
    const result = db.collection('tokensProf').find().toArray();
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
         

    return db.collection('expressions').find().toArray();
        
    } catch (error) {
        console.log("Turma não encontrada!") 
        console.log("Error:"+error)
        return false
    }

}


const addTurma = async (turma,nomeTurma) =>
{
     try {
        const db = await connect();
        
        result=await db.collection('expressions').find().toArray();
            
            const insert = await db.collection('expressions').updateOne(
                { "id": "abcdefg" }, {
                    $set: {[nomeTurma]:turma}//adicinar Turma
            }
            
            )
    
        return result

     } catch (error) {
         console.log(error)
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

    return result

}




module.exports = { getAll,add_Expression,addTurma,addToken}