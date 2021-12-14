const express = require('express')
const app = express()
const http = require('http').createServer(app)
const fs=require("fs")
require('./SocketService')(http)

class App {
    constructor(port) {
        this.port = port ? port : 3000
    }

    start() {
        app.get('/health', (req, res) => {
            res.send({
                status: 'UP'
            })
        })
        app.use(express.json())
        app.set('view engine','ejs')
        //save video
        app.post('/data',(req,res)=>{            

            const file=fs.createWriteStream('./src/videos/'+req.headers.name+".webm")            
            req.on('data',chunk=>{
             file.write(chunk)
            })      
                          
            req.on('end',()=>{
                file.end()
                res.send("ok")
                
            })
           
        }) 
        //save emotions
        app.put('/json',(req,res)=>{
        try {
            console.log(req.body)
          res.send("ok")
        } catch (error) {
            console.log(error)
        }
          
          
        })
        app.get('/sala/aluno', (req, res) => {
            res.render(__dirname+"/index")
          })
        ///
        
        app.use(express.static('public'))
                
        http.listen(this.port, () => {
            console.log(`server up at port: ${this.port}`)
        })
    }
}

module.exports = (port) => {
    return new App(port)
}