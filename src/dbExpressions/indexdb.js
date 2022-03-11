const { getAll, addToken, add_Expression, getReport } = require("./crud")
const moment = require("moment")


const getClass = async (token) => {

    var result = await getAll()
    var result = isToken(result, token)

    return result

}
const isToken = (result, token_aula) => {

    try {

        var turmaResult = ""
        var id = ""

        for (var i = 0; i < result.length; i++) {

            var turma = result[i]._id
            var list_token = result[i]["tokens"][0][turma]

            for (var k = 0; k < list_token.length; k++) {

                if (list_token[k]["token-aula"] === token_aula) {
                    turmaResult = turma
                    id = (list_token[0]["id"])
                    break
                }

            }
        }

    } catch (error) {

        console.log(error)
    }

    result_ = []
    result_.push(turmaResult)
    result_.push(id)
    return result_


}

const addExpression = async (turma, id, emotion, matricula, pct, h, m, s) => {


    try {

        let data = moment().format("DD/MM/YYYY");
        update = {

            "porcentagem": pct,
            "hora": h,
            "minutos": m,
            "segundos": s

        }

        if (turma && id) {

            await add_Expression(id, turma, matricula, update, emotion, data);

        }



    } catch (error) {
        console, log(error)

    }

}

//adicinar token da aula  na disciplina
const addToken_ = async (turma, token) => {


    await addToken(turma, token)


}

const validateToken = async (token_prof, token_aula) => {
    try {
        valid_token_prof = false
        valid_token_aula = false
        result = await getAll()
        if (result != null) {
            list = (Object.keys(result[0]["tokens"][0]))
            for (var i = 0; i < list.length; i++) {

                if (list[i] == token_prof) {

                    valid_token_prof = true
                    tokensList = result[0]["tokens"][0][list[i]]
                    resultToken = tokensList.filter(item => item["token-aula"] == token_aula)
                    if (resultToken) { valid_token_aula = true }

                }

            }


            return (valid_token_aula == true && valid_token_prof == true)
        } else {
            return false
        }


    } catch (error) {
        console.log(error)
        return false

    }



}
const validateTokenProf = async (token_prof) => {
    try {
        valid_token_prof = false
        result = await getAll()
        if (result != null) {
                        
            for (var i = 0; i < result.length; i++) {
                list = (Object.keys(result[i]["tokens"][0]))

                for (var j = 0; j < list.length; j++) {
                     console.log(list[j])
                    if (list[j] == token_prof) {

                        valid_token_prof = true

                    }

                }


            }

            // for(var i=0;i<list.length;i++){ 


            //     if(list[i]==token_prof){  

            //     valid_token_prof=true          

            //     }

            // }



            return valid_token_prof
        } else {
            return false
        }


    } catch (error) {
        console.log(error)
        return false

    }



}


const addEmotion = async (array) => {
    var obj = JSON.parse(array["resultJson"][0])
    arrayGetTurma = await getClass(obj.token)
    turma = arrayGetTurma[0]
    id = arrayGetTurma[1]
    if (turma && id) {

        for (var i = 0; i < array["resultJson"].length; i++) {
            var objeto = JSON.parse(array["resultJson"][i])
            try {

                addExpression(turma, id, objeto.expression, objeto.matricula, objeto.porcentagem, objeto.hora, objeto.minutos, objeto.segundos)


            } catch (error) {
                console.log(error)
            }

        }
    } else {
        console.log("não inserido")
    }



}
const get_Report = async (token) => {

    array = await getClass(token)
    turma = array[0]
    id = array[1]
    let data = moment().format("DD/MM/YYYY");

    var qtdMatriculas = 1
    var sumEmotions = 0
    var sumDuvida = 0
    var emotions = new Map();
    emotions.set("neutral", 0)
    emotions.set("happy", 0)
    emotions.set("sad", 0)
    emotions.set("angry", 0)
    emotions.set("fearful", 0)
    emotions.set("disgusted", 0)
    emotions.set("surprised", 0)
    emotions.set("duvida", 0)

    var infoTurma = new Map();

    infoTurma.set("data", data)
    infoTurma.set("turma", turma)

    var arrayMediaInd = []

    result = await getReport(id)

    if (result != null) {
        array = result[0][turma]["alunos"]


        for (var i = 0; i < array.length; i++) {
            listday = array[i][data]
            if (listday == null) {

                break
            }
            arrayExpressions = Object.keys(listday)


            if (arrayExpressions) {

                qtdMatriculas = arrayExpressions.length
                arrayExpressions.forEach(matricula => {

                    arrayemotions = (array[i][data][matricula])

                    //selecionar pela data

                    var ob = createObject()
                    ob.matricula = matricula

                    for (var [key, value] of emotions) {

                        if (arrayemotions[key]) {

                            ob[key] = (arrayemotions[key].length)
                            newvalue = ((arrayemotions[key].length) + value)
                            emotions.set(key, newvalue)



                        }
                    }
                    arrayMediaInd.push(ob)


                });
            }

        }


    }


    for (var [key, value] of emotions) {
        sumEmotions += value

    }

    //criar media individual

    for (var i = 0; i < arrayMediaInd.length; i++) {

        for (var [key, value] of emotions) {
            if (key != "duvida") {
                if (value > 0) {
                    newValue = ((arrayMediaInd[i][key]) * 100) / value
                    arrayMediaInd[i][key] = parseFloat(newValue.toFixed(2))

                }


            }

        }

    }


    for (var i = 0; i < arrayMediaInd.length; i++) {

        valor = parseFloat(arrayMediaInd[i].sad) + parseFloat(arrayMediaInd[i].angry)
        arrayMediaInd[i].duvida = parseFloat(valor.toFixed(2))

    }


    //

    for (var [key, value] of emotions) {

        var pc = (value * 100) / sumEmotions
        emotions.set(key, pc.toFixed(2))

        if (key == "sad" || key == "angry") {
            sumDuvida += pc
        }

    }


    emotions.set("duvida", sumDuvida.toFixed(2))




    dataEmotions = []
    dataEmotions.push(emotions)
    dataEmotions.push(infoTurma)
    dataEmotions.push(arrayMediaInd)



    return dataEmotions

}

function createObject() {
    ob = {
        matricula: "",
        neutral: 0,
        happy: 0,
        sad: 0,
        angry: 0,
        fearful: 0,
        disgusted: 0,
        surprised: 0,
        duvida: 0
    }
    return ob

}


module.exports = { validateToken, validateTokenProf, addToken_, addEmotion, get_Report }






