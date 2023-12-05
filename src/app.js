import express from 'express'
import routerProducts from './router/products.router.js'
import routerCart from './router/cart.router.js'
import handlebars from 'express-handlebars'
import __dirname from './util.js'
import viewsRouter from './router/view.router.js'
import sessionRouter from './router/session.router.js'
import { Server, Socket } from 'socket.io'
import mongoose from "mongoose";
import ProductsMongo from "./router/productsMongo.router.js"
import CartMongo from "./router/cartMongo.router.js"
import chatMongo from "./router/chatMongo.router.js"
import session from 'express-session'
import mongoStore from 'connect-mongo'

//import routerCarts from './router/carts.router.js'
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//mongoose
const mongoURL = 'mongodb+srv://juanih1990:963258527415963@clustercursobackend.ddoeaet.mongodb.net/'
const mongoDBName = 'productos'
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.engine('handlebars', handlebars.engine())
//seteo las vistas 
app.set('views', __dirname + '/views')
//indicamos que motor de plantilla usar
app.set('view engine', 'handlebars')


app.use('/static', express.static(__dirname + '/public'))


//Session
app.use(session ({
    store: mongoStore.create({
        mongoUrl: mongoURL,
        dbName: mongoDBName
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))
  

// Middleware para usuarios normales
function Auth(req, res, next) {
    if (req.session?.user) {
        return next();
    } else {
        res.status(401);
        return res.render('errorSession',  {});
    }
}

app.use('/' , sessionRouter )
app.use('/productos' , Auth, ProductsMongo) 
app.use('/productos' , Auth, chatMongo) 
app.use('/productos' , Auth, CartMongo) 


//conexion mongo
const httpServer = app.listen(8080, () => {
    console.log('Listening Go')
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
        })
        .catch((e) => console.log('Error al intentar conectar a la DB'))
})