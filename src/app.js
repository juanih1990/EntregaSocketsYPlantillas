import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './util.js'
import sessionRouter from './router/session.router.js'
import { Server, Socket } from 'socket.io'
import mongoose from "mongoose";
import ProductsMongo from "./router/productsMongo.router.js"
import CartMongo from "./router/cartMongo.router.js"
import chatMongo from "./router/chatMongo.router.js"
import session from 'express-session'
import mongoStore from 'connect-mongo'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import initializePassportGithub from './config/passportGithub.config.js'
import cookieParser from 'cookie-parser'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//mongoose
const mongoURL = 'mongodb+srv://juanih1990:963258527415963@clustercursobackend.ddoeaet.mongodb.net/'
const mongoDBName = 'productos'

//handlebars
app.engine('handlebars', handlebars.engine())
//seteo las vistas 
app.set('views', __dirname + '/views')
//indicamos que motor de plantilla usar
app.set('view engine', 'handlebars')
app.use('/static', express.static(__dirname + '/public'))

//Session
app.use(cookieParser())

app.use(session ({
    store: mongoStore.create({
        mongoUrl: mongoURL,
        dbName: mongoDBName,
        ttl: 86400  //un dia
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))
  
//passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())
 
initializePassportGithub()
app.use(passport.initialize())
app.use(passport.session())
 
app.use('/' , sessionRouter )
app.use('/productos' ,  ProductsMongo) 
app.use('/productos' ,  chatMongo) 
app.use('/productos' , CartMongo) 


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