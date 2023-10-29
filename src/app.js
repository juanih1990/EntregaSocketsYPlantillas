import express from 'express'
import routerProducts from './router/products.router.js'
import routerCart from './router/cart.router.js'
import handlebars from 'express-handlebars'
import __dirname  from './util.js'
import viewsRouter from './router/view.router.js'
import {Server, Socket} from 'socket.io'

//import routerCarts from './router/carts.router.js'
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//Inicializo el motor de plantilla 
app.engine('handlebars' , handlebars.engine())
//seteo las vistas 
app.set('views' , __dirname + '/views')
//indicamos que motor de plantilla usar
app.set('view engine', 'handlebars')
app.use('/static' ,express.static(__dirname + '/public'))
app.get('/', viewsRouter)
app.use('/api/products', routerProducts)
app.use('/api/carts', routerCart)
app.get('/realTimeProducts',viewsRouter)

//app.use('/api/carts', routerCarts)

const httpServer = app.listen(8080)
const socketServer = new Server(httpServer)
app.set('io', socketServer); // Almacena io en app
socketServer.on('connection' , socket => {

    console.log("Gracias por elegirnos, gestiona tus productos")
   /* socket.on('message', data => {
        console.log(data)
        socket.broadcast.emit('mensajeAlResto' , data)
    })   */
    
})