import express from 'express'
const app = express()
import moment from 'moment'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

import os from 'os'
import cluster from 'cluster'
import process from 'process'

const numCpu = os.cpus().length


app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        message: 'Server Works',
        cpusLength: os.cpus().length,
        cups: os.cpus()
    })
})

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        timeout : 10000, 
        transports : ["websocket"]
    }
});
io.on('connection', (socket) => {
    console.log(`User ID : ${socket.id}`);
    socket.on('send_msg', (data) => {
        console.log(data);
        let obj = {
            time: moment().format('MMMM Do YYYY, h:mm:ss a'),
            text: data.message
        }
        socket.broadcast.emit('receive_msg', obj)
    })
})

if (cluster.isPrimary) {
    for (let i = 0; i < numCpu; i++) {
        cluster.fork()//create separate cpu
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker died ${worker.process.pid}`)
        cluster.fork()
    })

} else {

    server.listen(process.env.PORT || 3001, () => console.log(` server ${process.pid},Backend Running...`))

}
