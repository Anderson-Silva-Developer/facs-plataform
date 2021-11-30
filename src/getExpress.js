

const  faceapi =require('face-api.js')
const canvas = require('canvas')
const fs =require('fs')
const path=require('path')
const ffmpeg = require('fluent-ffmpeg');
const extractFrames = require('ffmpeg-extract-frames');


const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

const faceDetectionNet = faceapi.nets.ssdMobilenetv1
// SsdMobilenetv1Options
const minConfidence = 0.5
// TinyFaceDetectorOptions
const inputSize = 408
const scoreThreshold = 0.5
function getFaceDetectorOptions(net) {
    
  return net === faceapi.nets.ssdMobilenetv1
    ? new faceapi.SsdMobilenetv1Options({ minConfidence })
    : new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
}

const faceDetectionOptions = getFaceDetectorOptions(faceDetectionNet)

const baseDir = path.resolve(__dirname, '../out')

function saveFile(fileName, buf) {
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir)
  }

  fs.writeFileSync(path.resolve(baseDir, fileName), buf)
}

async function run() {
  // setInterval(async () => {
  //   console.log("===================")
  // },100);

  await faceDetectionNet.loadFromDisk('./src/weights')
  await faceapi.nets.faceLandmark68Net.loadFromDisk('./src/weights')
  await faceapi.nets.faceExpressionNet.loadFromDisk('./src/weights')
  
  const img = await canvas.loadImage('./src/save_frames/img-1.jpg')
  // const img = await canvas.loadImage('./src/images/happy.jpg')
  const results = await faceapi.detectAllFaces(img, faceDetectionOptions)
  .withFaceLandmarks()
  .withFaceExpressions()

  // const out = faceapi.createCanvasFromMedia(img) 
  // faceapi.draw.drawDetections(out, results.map(res => res.detection))
  // faceapi.draw.drawFaceExpressions(out, results)

  // saveFile('faceExpressionRecognition.jpg', out.toBuffer('image/jpeg'))
  // console.log('done, saved results to out/faceExpressionRecognition.jpg')

  console.log(results[0]["expressions"])
}

async function Extract(){

 
  var path = "./src/videos/facefacs.webm"
  var pathDir = "./src/save_frames/"
  


  // ffmpeg.ffprobe(path,(err,metaData)=>{

    await extractFrames({
      input: path,
      output:pathDir+"img-%d.jpg", 
      fps:1,
    })

  // });
  
 
}

Extract()
// run()

//pesquisar
//https://github.com/justadudewhohacks/face-api.js/issues/150


