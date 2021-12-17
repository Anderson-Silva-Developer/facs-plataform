const connect = require("./db")


const getAll = async () =>
{
   try {
    const db = await connect();
    // const result = db.collection('expressions').find().toArray();
    const result = db.collection('tokensProf').find().toArray();
    return result;

   } catch (error) {
       console.log(error)
   }
}

const updateAluno = async (turma,matricula,update,emotion,data) =>
{
    
    try {

    const db = await connect();
    updateAluno_=""+[turma]+".alunos.$[]."+[data]+"."+[matricula]+"."+[emotion]
    
    

    const insert = await db.collection('expressions').updateOne(
        { "id": "abcdefg" }, {
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


const deleteAll = async () =>
{
    try {
      const db = await connect();
      const result = await db.collection('expressions').drop();
    return true;
    } catch (error) {
        console.log(error)
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
const addToken=async (turma,token) =>{    
    const db = await connect();   
    addToken_="tokens.$[]."+[turma] 
    const insert = await db.collection('tokensProf').updateOne(
        { "_id": "tokensId" }, {
            $push: {

            [addToken_]:{"token-aula":token}

            }
    }

    )

    console.log(result)

}
///criar coleção
const newcollection=async () =>{
    const db = await connect();
    result=await db.collection('expressions').insertOne({ "_id": "20171cxcc0308"})
    console.log(result)

    add()

}
const add=async () =>{
    console.log("pppppppppp")
    const db = await connect();    
    const insert = await db.collection('expressions').updateOne(
        { "_id": "20171cxcc0308" }, {
            $push: {

            ["alunos"]:{}

            }
    }

    )

    console.log(result)

}



module.exports = { getAll, updateAluno, deleteAll,addTurma,newcollection,addToken}