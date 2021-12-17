const { Console } = require('console')
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const fs=require("fs")
const {validateToken} = require("../src/dbExpressions/indexdb")
const jwt=require("jsonwebtoken")
const SECRET="secretfacafacs"
require('./SocketService')(http)

class App {
    constructor(port) {
        this.port = port ? port : 3000
    }
     

    start() {

        function verifyJWT(req,res,next) {
            const token=req.headers['x-access-token']
            jwt.verify(token,SECRET,(err,decoded)=>{
                if(err) return res.json({auth:false})
                console.log("verificação com sucesso"+token)
                next()
            })

            
        }
        app.get("/auth",verifyJWT,(req,res)=>{
            res.json({auth:true})
        })
       

        app.get('/health', (req, res) => {
            res.send({
                status: 'UP'
            })
        })
           
        app.use(express.json())      
        //save emotions
        app.put('/json',(req,res)=>{
        try {
            console.log(req.body)
          res.send("ok")
        } catch (error) {
            console.log(error)
        }          
          
        })
        app.post('/getToken',(req,res)=>{                         
            if(validateToken(req.body.token)){
                const token=jwt.sign({userId:1},SECRET,{expiresIn:60})
                console.log(token)
                return res.json({auth:true,token})

            }else{
                res.status(401).end()
            }
                     
                     
        }) 
            
        app.use(express.static('public'))
                
        http.listen(this.port, () => {
            console.log(`server up at port: ${this.port}`)
        })
    }
}


module.exports = (port) => {
    return new App(port)
}