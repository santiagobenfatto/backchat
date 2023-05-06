import express from 'express'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.routes.js'
import { Server } from 'socket.io'


const app = express()
const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => {
    console.log(`Server active and running on ${PORT}`)
})

const io = new Server (server)


app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')
app.use(express.static(`${__dirname}/public`))

app.use('/', viewsRouter)


let messages = []

//Io.on('connection') es el handshake
io.on('connection', socket => {
    console.log('New client connected')

    //Leemos el evento 'message, del que vamos a recibir DATA
    socket.on('message', data => {
        messages.push(data)
        io.emit('messageLogs', messages)
    })

    socket.on('authenticated', data => {
        socket.emit('messageLogs', messages)
        socket.broadcast.emit('newUserConnected', data)
    })

})

