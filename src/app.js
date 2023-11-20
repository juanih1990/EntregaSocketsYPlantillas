import express from 'express'
import routerProducts from './router/products.router.js'
import routerCart from './router/cart.router.js'
import handlebars from 'express-handlebars'
import __dirname from './util.js'
import viewsRouter from './router/view.router.js'
import { Server, Socket } from 'socket.io'
import mongoose from "mongoose";
import ProductsMongo from "./router/productsMongo.router.js"
import CartMongo from "./router/cartMongo.router.js"
import chatMongo from "./router/chatMongo.router.js"

//import routerCarts from './router/carts.router.js'
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//mongoose
const mongoURL = 'mongodb+srv://juanih1990:963258527415963@clustercursobackend.ddoeaet.mongodb.net/'
const mongoDBName = 'productos'
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Inicializo el motor de plantilla 
app.engine('handlebars', handlebars.engine())
//seteo las vistas 
app.set('views', __dirname + '/views')
//indicamos que motor de plantilla usar
app.set('view engine', 'handlebars')


app.use('/static', express.static(__dirname + '/public'))

//filesystem
app.get('/', viewsRouter)
app.use('/productos/chat', chatMongo)
app.use('/productos', ProductsMongo)
app.use('/productos', CartMongo)
app.use('/api/products', routerProducts)
app.use('/api/carts', routerCart)
app.get('/realTimeProducts', viewsRouter)




//conexion mongo
const httpServer = app.listen(8080, () => {
    console.log('Listening Go');
mongoose.connect(mongoURL, { dbName: mongoDBName })
    .then(() => {
        console.log('DB conectada ...')
      
        //Chat
        const io = new Server(httpServer)

        const messages = []

        io.on('connection', socket => {
            console.log('new socket')

            socket.on('message', data => {
                messages.push(data)
                console.log(data)
                io.emit('logs', messages)
            })

        })
        //
    })
    .catch((e) => console.log('Error al intentar conectar a la DB'))
})