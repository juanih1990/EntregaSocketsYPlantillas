import passport from 'passport'
import  { Router } from 'express';

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
            res.cookie('cookieJWT' ,  req.user.token).redirect('/productos/listarProductos')
       
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

router.get(
    '/github' , 
    passport.authenticate('github' , {scope: ['user:email']}),
    async (req,res) => {
        console.log("entre 2")

})
router.get(
    '/githubcallback',
    (req, res, next) => {
        //Hice distinto el get que lo visto en clase por q a veces me redireccionaba antes q termine de loguear
        // El middleware de autenticación de Passport se ejecutará
        passport.authenticate('github', { failureRedirect: '/errorSession' })(req, res, next);
    },
    (req, res) => {
      // req.session.user = req.user;
       // console.log( "aka")
       if(!req.user){
            return res.status(400).send("Invalid github")
       }
        res.cookie('cookieJWT' ,  req.user.token).redirect('/productos/listarProductos')
    }
)

router.get('/logout', (req, res) => {
    if (req.isAuthenticated()) {
       // Utiliza req.logout con una función de devolución de llamada
       req.logout((err) => {
        if (err) {
            console.error('Error al realizar el logout:', err);
            res.status(500).send('Error al realizar el logout');
        } else {
            // Elimina el token JWT almacenado en la cookie
            res.clearCookie('cookieJWT');

            // Destruye la sesión
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error al destruir la sesión:', err);
                    res.status(500).send('Error al destruir la sesión');
                } else {
                    // Redirige después de cerrar sesión y eliminar el token
                    res.redirect('/');
                }
            });
        }
    });
    } else {
        // Si el usuario no está autenticado, redirige inmediatamente
        res.redirect('/');
    }
})



export default router