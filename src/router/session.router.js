//import express from 'express'
//import session from 'express-session'
import passport from 'passport'
import { Router } from 'express';
//import sessionModel from '../dao/models/session.model.js'


const router = Router();


router.get('/', (req, res) => {
    console.log(req.session)
    res.render("login", { session: req.session })
})


router.get('/login/registerView', (req, res) => {
    res.render('register', {})
})

router.post(
    '/login/users',
    passport.authenticate('login', { failureRedirect: '/'   }),
    async (req, res) => {

        //passport login 
        try {
            if (!req.user) return res.status(400).send('Invalid Credentials')
            req.session.user = req.user;
            console.log(req.session.user)
            res.redirect('/productos/listarProductos');
        } catch (error) {
            console.error('Error al redireccionar:', error);
            res.status(500).send('Error al redireccionar');
        }

    }
)

router.post(
    '/login/register',
    passport.authenticate('register', { failureRedirect: '/' }),
    async (req, res) => {
        res.redirect('/')
    }
)

router.get('/logout', (req, res) => {
    if (req.isAuthenticated()) {
        // Si el usuario todavía está autenticado, espera a que la sesión se destruya
        req.session.destroy((err) => {
            if (err) {
                console.error('Error al destruir la sesión:', err);
                res.status(500).send('Error al destruir la sesión');
            } else {
                // Redirige solo después de que la sesión se haya destruido completamente
                res.redirect('/');
            }
        });
    } else {
        // Si el usuario no está autenticado, redirige inmediatamente
        res.redirect('/');
    }
})



export default router