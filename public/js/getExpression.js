



function Expression(){
  document.getElementById('local-player').srcObject = myStream
    resultJson=""
    sendTime=10000
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

            resultJson+=JSON.stringify(
              { 
                "matricula":"20171cxcc0325",
                "expression":expression,
                "porcentagem":porcentagem,
                "hora": new Date().getHours(),
                "minutos":new Date().getMinutes(),
                "segundos":new Date().getSeconds()
               });
               
          
        } catch (error) {
            console.log("não definida")
        }

        },5000);
         //post emotions 
        setInterval(() => {
          if(resultJson.length>0){
          // postExpressions(resultJson)
          // console.log(resultJson.length)
          console.log(resultJson)
          resultJson=""
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
