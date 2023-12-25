import passport from 'passport'
import local from 'passport-local'
import userModel from '../dao/models/user.model.js'
import { createHash, isValidatePassword } from '../util.js'
import passportJWT from "passport-jwt"
import { generateToken } from '../util.js' 

const JWTSrategy = passportJWT.Strategy

const LocalStrategy = local.Strategy

const initializePassport = () => {

    passport.use('register', new LocalStrategy({

        passReqToCallback: true, // tener acceso al req como un middleware
        usernameField: 'email'

    }, async (req, username, password, done) => {
        const { firest_name, last_name, age_name, email } = req.body

        try {
            const user = await userModel.findOne({ email: username })
            if (user) {
                console.log('user alredy exist')
                return done(null, false)
            }

            const newUser = {
                firest_name,
                last_name,
                age_name,
                email,
                password: createHash(password)
            }
            const result = await userModel.create(newUser)
            return done(null, result)
        } catch (error) {
            done('Error to register' + error)
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {

             // Verificar si es el usuario administrador
             if (username === 'admin@gmail.com' && password === 'admin1234') {
                const user = { email: 'admin@gmail.com', password: 'admin1234' };   
                const token = generateToken(user)
                user.token = token          
                return done(null, user);
            }

            const user = await userModel.findOne({ email: username }).lean().exec()

           

            if (!user) {
                console.log('User doent exist')
                return done(null ,false)
            }

            if (!isValidatePassword(user, password)) {
                console.error('password not valid')
                return done(null, false)
            }

              
            const token = generateToken(user)
            user.token = token
            return done(null, user)
        } catch (error) {
            return done('Error login' + error)
        }
    }))

    passport.use('jwt' , new JWTSrategy({
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([req => req?.cookies?.cookieJWT ?? null]),
        secretOrKey: 'secretForJwt'
    }, (jwt_payload,done) => {
        done(null,jwt_payload)
    }))

    passport.serializeUser((user, done) => {
        if (user && user.email === 'admin@gmail.com') {
            // Si es el usuario administrador, usar un identificador único
            done(null, 'admin');
        } else if (user && user._id) {
            // Si es un usuario normal, usar su _id
            done(null, user._id);
        } else {
            done(new Error('No se puede serializar el usuario'));
        }
    })

    passport.deserializeUser(async (id, done) => {
        if (id === 'admin') {
            // Manejar lógica especial para el usuario administrador
            const adminUser = { email: 'admin@gmail.com', role: 'admin' };
            done(null, adminUser);
        } else {
            // Si es un usuario normal, buscar en la base de datos por el _id
            const user = await userModel.findById(id);
            done(null, user);
        }
    })

}

export default initializePassport