
video = document.getElementById("local-player")
resultJson=""
sendTime=10000

function Expression(){
    
    video.addEventListener("play", () => {
        const canvas = faceapi.createCanvasFromMedia(video);              
        const displaySize = { width:video.width, height:video.height};
        faceapi.matchDimensions(canvas, displaySize);   
        
        document.getElementById("video").append(canvas)
         
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
               
            //  console.log(resultJson)
            //  console.log(resultJson.length)
            // document.getElementById("status").innerHTML=resultJson



          // const resizedDetections = faceapi.resizeResults(detections, displaySize);
          // canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
          // faceapi.draw.drawDetections(canvas, resizedDetections);
          // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
          // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        } catch (error) {
            console.log("não definida")
        }

        },5000);
         //post emotions 
        setInterval(() => {
          if(resultJson.length>0){
          postExpressions(resultJson)
          console.log(resultJson.length)
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
