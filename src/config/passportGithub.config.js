import passport from 'passport'
import GitHubStrategy from 'passport-github2'
import userModel from '../dao/models/user.model.js'
import passportJWT from "passport-jwt"
import { generateToken } from '../util.js' 

const JWTSrategy = passportJWT.Strategy
const initializePassportGithub = () => {

    

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.5181b049f862794d',
        clientSecret: 'e8581b59680234504826883a891cff50114b4ad3',
        callbackUrl: 'http://localhost:8080/githubcallback'
    }, async (accesToken, refreshToken, profile, done) => {
        console.log(profile)
        try {
            const user = await userModel.findOne({ email: profile._json.email })
            if (!user) {
                const newUser = await userModel.create({
                    firest_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email,
                    password: ''
                })
                const result = await userModel.create(newUser)
                console.log("usuario registrado")
            }
          
            const token = generateToken(user)
            user.token = token
        
            console.log(user.token)
            return done(null, user)

        } catch (error) {
            return done('Error tologin with github' + error)
        }
    }))

    passport.use('jwt' , new JWTSrategy({
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([req => req?.cookies?.cookieJWT ?? null]),
        secretOrKey: 'secretForJwt'
    }, (jwt_payload,done) => {
        done(null,jwt_payload)
    }))

    passport.serializeUser((user, done) => {
        done(null, user_id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}
export default initializePassportGithub