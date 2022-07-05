import express from 'express'
const app = express()
import moment from 'moment'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

app.use(cors())
app.use(express.json())

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`User ID : ${socket.id}`);
    socket.on('send_msg', (data) => {
        console.log(data);
        let obj = {
            time:moment().format('MMMM Do YYYY, h:mm:ss a'),
            text:data.message
        }
        socket.broadcast.emit('receive_msg',obj)
    })
})

app.get('/' , (req , res) => {
    res.json('Server Works')
})

server.listen(process.env.PORT || 3001)
