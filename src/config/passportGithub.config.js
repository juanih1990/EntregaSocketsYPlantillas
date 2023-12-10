import passport from 'passport'
import GitHubStrategy from 'passport-github2'
import userModel from '../dao/models/session.model.js'

const initializePassportGithub = () => {

    passport.use('github' , new GitHubStrategy({
        clientID: 'Iv1.5181b049f862794d',
        clientSecret: 'e8581b59680234504826883a891cff50114b4ad3',
        callbackUrl: 'http://localhost:8080/githubcallback'
    }, async(accesToken,refreshToken,profile,done) => {
                console.log(profile)
                try {
                    console.log("entre 1")
                        const user = await userModel.findOne({email: profile._json.email} )
                        if(user){
                            console.log("Usuario registrado")
                            return done(null,user)
                        }
                        const newUser = await userModel.create({
                            firest_name: profile._json.name,
                            last_name: '',
                            email: profile._json.email,
                            password: ''
                        })
                        return done(null,newUser)
                } catch (error) {
                    return done('Error tologin with github' + error)
                }
    }))

    passport.serializeUser((user,done) => {
            done(null , user_id)
    })

    passport.deserializeUser(async(id,done) => {
        const user = await userModel.findById(id)
        done(null,user)
    })
}
export default initializePassportGithub