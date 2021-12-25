



function Expression(){
  document.getElementById('local-player').srcObject = myStream
    resultJson=[]
    sendTime=60000
    video = document.getElementById("local-player")
  
  
    video.addEventListener("play", () => { 
               
        setInterval(async () => { 
          try {          
                                                
          const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();
            array=detections[0]["expressions"]
            
            porcentagem=0
            expression=""
            Object.entries(array).forEach(([key, value]) => {
              if(value>porcentagem){
                 porcentagem=value
                 expression=key
              }              

            });    
            if(localStorage.getItem("status")==="start"){
              // console.log("gravando")

            resultJson.push(JSON.stringify(
              { "token":localStorage.getItem('inputTokenAluno'),
                "matricula":localStorage.getItem('matricula_aluno'),
                "expression":expression,
                "porcentagem":porcentagem,
                "hora": new Date().getHours(),
                "minutos":new Date().getMinutes(),
                "segundos":new Date().getSeconds()
               }))

            }
            // else{
            //   console.log("gravação pausada")
            // }   
               
          
        } catch (error) {
            console.log("")
        }

        },5000);
         //post emotions 
        setInterval(() => {
          if(resultJson.length>0){
            if(localStorage.getItem("status")==="start"){  
          postExpressions(resultJson)
          }else{
            console.log(" post: gravação pausada")
          }
          
          resultJson=[]
         }     

        },sendTime);
              

      }); 
   

}

function postExpressions(resultJson){  
  
  axios.put("/json",{resultJson})
    .then(response => {
      console.log(response.status);
    });
    

}
