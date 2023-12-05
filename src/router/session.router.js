import express from 'express'
import session from 'express-session'
import { Router } from 'express';
import sessionModel from '../dao/models/session.model.js'


const router = Router();

/*
router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))*/

router.get('/', (req, res) => {
    console.log(req.session)
    res.render("login", { session: req.session })
})


router.get('/login/registerView', (req, res) => {
    res.render('register', {})
})

router.post('/login/users', async (req, res) => {
    try {
        const { email, password } = req.body
       // console.log('Datos del formulario:', email, password);
        if(email === 'admin@gmail.com' && password === 'admin1234'){
            req.session.user = { email: 'admin@gmail.com', password: 'admin1234' };
            return res.redirect('/productos/listarProductos');   
         }


        const user = await sessionModel.findOne({ email, password })
       // console.log('Usuario encontrado en la base de datos:', user);
       
        if (!user) {
            return res.status(401).send('Invalid username or password');
        }
        else{
            req.session.user = user
           // console.log('Usuario autenticado:', req.session.user);
            return  res.redirect('/productos/listarProductos');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send(`IInternal Server Error ${error.message}`);
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