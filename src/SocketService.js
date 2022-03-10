
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
                socket.matricula = matricula;
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

                socket.join(room)

                socket.to(room).emit(EVENT_CALL, { id: (socket.id), matricula: (socket.matricula) })

                socket.on(EVENT_OFFER, (data) => {

                    socket.to(data.id).emit(EVENT_OFFER, {
                        id: socket.id,
                        offer: data.offer
                    })
                })

                socket.on(EVENT_ANSWER, (data) => {
                    socket.to(data.id).emit(EVENT_ANSWER, {
                        id: socket.id,
                        answer: data.answer
                    })
                })

                socket.on(EVENT_CANDIDATE, (data) => {
                    socket.to(data.id).emit(EVENT_CANDIDATE, {
                        id: socket.id,
                        candidate: data.candidate
                    })
                })

                socket.on(EVENT_DISCONNECT, () => {
                    this.io.emit(EVENT_DISCONNECT_USER, {
                        id: socket.id,
                        matricula: (socket.matricula)
                    })
                })

                socket.on('start', (msg) => {

                    socket.broadcast.emit('start', msg)
                })
                socket.on('stop', (msg) => {

                    socket.broadcast.emit('stop', msg)
                })
                socket.on('feedback_start', (matricula) => {
                    socket.broadcast.emit('feedback', matricula)
                })
                socket.on('getId', (id) => {
                    socket.broadcast.emit('getId', id)
                })
                socket.on('postId', (matricula) => {
                    socket.broadcast.emit('responseGetId', matricula)
                })
                //recuperar status da gravação
                socket.on('gravando', (id, status) => {
                    socket.to(id).emit("gravando", status)
                })



            }
        })
    }
}

module.exports = (http) => {
    return new SocketService(http)
}