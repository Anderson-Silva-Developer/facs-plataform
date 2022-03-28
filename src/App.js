
const express = require('express')
const app = express()
const http = require('http').createServer(app)

class App {
    constructor(port) {
        this.port = port ? port : 3000
    }

    async start() { 
                   
        app.use(express.static('public'))
                
        http.listen(this.port, () => {
            console.log(`server up at port: ${this.port}`)
        })
    }
}


module.exports = (port) => {
    return new App(port)
}