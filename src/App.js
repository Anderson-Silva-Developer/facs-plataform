
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const fs=require("fs")
const ejs=require("ejs")
const path=require("path")
const pdf=require("html-pdf")
const {validateToken,validateTokenProf,addToken_,addEmotion,get_Report} = require("../src/dbExpressions/indexdb")
const {sendEmail} =require("./report/sendReportMail")
const jwt=require("jsonwebtoken")
const SECRET="secretfacafacs"
require('./SocketService')(http)
const DbConnection=require("./dbExpressions/db")
const moment = require("moment")



class App {
    constructor(port) {
        this.port = port ? port : 3000
    }

    async start() { 
      
                
        function verifyJWT(req,res,next) {
            const token=req.headers['x-access-token']
            jwt.verify(token,SECRET,(err,decoded)=>{
                if(err) return res.json({auth:false})
                
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
        app.put('/json',async(req,res)=>{           
           

        try {   
                         
                      
        addEmotion(req.body)                   

          res.send("ok")
        } catch (error) {
            console.log(error)
        }          
          
        }        
        
        )
        app.post('/getToken',async(req,res)=>{ 
            
            var isvalid=await validateTokenProf(req.body.token)   
            //     
            if(isvalid){                
                const token=jwt.sign({datatoken:moment().format("DD/MM/YYYY")},SECRET,{expiresIn:86400})                
                addToken_(req.body.token,token)//add token in room

                return res.json({auth:true,token})

            }else{
                res.json({auth:false})
            }
                     
                     
        }) 
        app.get('/isValid',async(req,res)=>{  
            try {
            
            var token_aula=req.headers['x-access-token-aula'] 
            var token_prof=req.headers['x-access-token-prof']
            var isvalid=await validateToken(token_prof,token_aula)           
              
            
            if(isvalid){                
                res.json({auth:true})        
                                                
            }else{
                res.json({auth:false})
            }
                
            } catch (error) {
                res.json({auth:false})
            }            
            

        })
        ///////
        app.get("/report",async (req,res)=>{    
            try {                
                const token=req.headers['x-access-token']
                var decodedToken = jwt.decode(token, {
                    complete: true
                   });
                   

                var  arrayResult=await get_Report(token,decodedToken.payload)
                
                if(arrayResult){
                var emotions=arrayResult[0]
                var inforTurma=arrayResult[1]
                var arrayMediaInd=arrayResult[2]              
                                       
                if(emotions){     
                        
                const filePath = path.join(__dirname, "../views/print.ejs") 
                       
                ejs.renderFile(filePath,{emotions,inforTurma,arrayMediaInd},{},(err,html)=>{
                        if(err){
                            return  res.send("Error")
                        }
                        const options = {
                            height: "11.25in",
                            width: "8.5in",
                            header: {
                                height: "20mm"
                            },
                            footer: {
                                height: "20mm"
                            }
                        }
                
                        // criar o pdf
                        pdf.create(html, options).toFile("report.pdf",(err, data)=> {
                            if (err) {
                                return res.send("Erro ao gerar o PDF" +err)
                            }                   
                           
                            sendEmail()                  
                            
                            
                         })
                         return res.send("ok")
           
           
                    }
                )
                }
            }
                
            } catch (error) {
                console.log(error)
                
            }
        
          
            
        })

        ////

            
        app.use(express.static('public'))
                
        http.listen(this.port, () => {
            console.log(`server up at port: ${this.port}`)
        })
    }
}


module.exports = (port) => {
    return new App(port)
}