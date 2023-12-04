import express from 'express'
import session from 'express-session'
import { Router } from 'express';
import sessionModel from '../dao/models/session.model.js'


const router = Router();

router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

router.get('/', (req, res) => {
    res.render("login", { session: req.session })
})


router.get('/login/registerView', (req, res) => {
    res.render('register', {})
})

router.post('/login/users', async (req, res) => {
    try {
        const { email, password } = req.body
        console.log("Estoy en el login :" + email + " " + password )
        if(email === 'admin@gmail.com' && password === 'admin1234'){
            req.session.user = { email: 'admin@gmail.com', password: 'admin1234' };
            return res.redirect('/');   
         }


        const user = await sessionModel.findOne({ email, password })
        if (!user) {
            return res.status(401).send('Invalid username or password');
        }
    
        req.session.user = user
        res.redirect('/');
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }

})

router.post('/login/register', async (req, res) => {
    const user = req.body
    await sessionModel.create(user)
    res.redirect('/')
})



router.get('/logout', (req, res) => {
    // Destruir la sesión
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
            return res.status(500).send('Error al cerrar sesión')
        }
        res.redirect('/')
    })
})

export default router