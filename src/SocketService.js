const { InMemorySessionStore } = require("./sessionStore");
const sessionStore = new InMemorySessionStore();
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");


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

       
         
        this.io.use((socket, next) => {
            
            const sessionID = socket.handshake.query.sessionID;
            if (sessionID) {
              // find existing session
              const session = sessionStore.findSession(sessionID);
              if (session) {
                socket.sessionID = sessionID;                
                socket.username = session.username;                
                return next();
              }
            }
            const username = socket.handshake.query.username;

            const sessionRoom=socket.handshake.query.sessionRoom;
            const typeUser=socket.handshake.query.typeUser;

            if (!username) {
              return next(new Error("invalid username"));
            }
            // create new session
            socket.sessionID = randomId();            
            socket.username = username;            
            next();
          });

        //===========================================
        this.io.on(EVENT_CONNECTION, (socket) => {

            const room = socket.handshake.query.token


            if (!room) {
                socket.disconnect()
            } else {
                // persistencia id
                
                socket.emit("session", {
                    sessionID: socket.sessionID,                   
                    username:socket.username,                            

                });
                //
                
                console.log(`novo aluno na room ${room}`)             
                console.log(socket.id)
                socket.join(room)
                console.log('requesting offers')
                socket.to(room).emit(EVENT_CALL, { id: (socket.id) })
                
                socket.on(EVENT_OFFER, (data) => {
                    console.log("==================")

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
                        id: socket.id
                    })
                })
            }
        })
    }
}

module.exports = (http) => {
    return new SocketService(http)
}