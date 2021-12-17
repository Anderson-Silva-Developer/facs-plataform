
const EVENT_CONNECTION = 'connection'
const EVENT_CALL = 'call'
const EVENT_OFFER = 'offer'
const EVENT_ANSWER = 'answer'
const EVENT_CANDIDATE = 'candidate'
const EVENT_DISCONNECT_USER = 'disconnect-user'

const EVENT_DISCONNECT = 'disconnect'

class SocketService {
    constructor(http) {
        this.init(http)
    }
   

    init(http) {
        this.io = require('socket.io')(http)
        this.io.use(async (socket, next) => {
            try {
              const matricula = socket.handshake.query.matricula
              socket.matricula =matricula;
              next()
            } catch (e) {
              next(new Error("unknown user"));
            }
          });
               
        this.io.on(EVENT_CONNECTION, (socket) => {

            const room = socket.handshake.query.token

            if (!room) {
                socket.disconnect()
            } else {
                                                
                console.log(`novo aluno na room ${room}`)             
                console.log(socket.id)
                socket.join(room)
                console.log('requesting offers')         

                socket.to(room).emit(EVENT_CALL, { id: (socket.id),matricula:(socket.matricula)})
                
                socket.on(EVENT_OFFER, (data) => {

                    console.log(`${socket.id} offering ${data.id}`)
                    socket.to(data.id).emit(EVENT_OFFER, {
                        id: socket.id,
                        offer: data.offer
                    })
                })

                socket.on(EVENT_ANSWER, (data) => {
                    console.log(`${socket.id} answering ${data.id}`)
                    socket.to(data.id).emit(EVENT_ANSWER, {
                        id: socket.id,
                        answer: data.answer
                    })
                })

                socket.on(EVENT_CANDIDATE, (data) => {
                    console.log(`${socket.id} sending a candidate to ${data.id}`)
                    socket.to(data.id).emit(EVENT_CANDIDATE, {
                        id: socket.id,
                        candidate: data.candidate
                    })
                })

                socket.on(EVENT_DISCONNECT, () => {
                    console.log(`${socket.id} disconnected`)
                    this.io.emit(EVENT_DISCONNECT_USER, {
                        id: socket.id,
                        matricula:(socket.matricula)
                    })
                })

                socket.on('start',(msg)=>{    
                    console.log(msg)               
                    socket.broadcast.emit('start',msg)
                })
                socket.on('stop',(msg)=>{    
                    console.log(msg)               
                    socket.broadcast.emit('stop',msg)
                })
                socket.on('feedback_start',(matricula)=>{                                   
                    socket.broadcast.emit('feedback',matricula)
                })
                socket.on('getId',(id)=>{                                                     
                    socket.broadcast.emit('getId',id)
                })
                socket.on('postId',(matricula)=>{                                                      
                    socket.broadcast.emit('responseGetId',matricula)
                })
                //recuperar status da gravação
                socket.on('gravando',(id,status)=>{                                                 
                    socket.to(id).emit("gravando",status)
                })


                                
            }
        })
    }
}

module.exports = (http) => {
    return new SocketService(http)
}