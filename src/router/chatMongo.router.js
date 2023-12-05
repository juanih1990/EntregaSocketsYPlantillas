import express  from "express"
import chatManagersMongo from "../dao/managers/managersMongo/chatManagersMongo.js"

const router = express.Router()

const chatmanagersMongo = new chatManagersMongo()

function sessionOpen(req, res, next) {
    res.locals.session = req.session;
    res.locals.isAdmin = req.session?.user?.email === 'admin@gmail.com' && req.session?.user?.password === 'admin1234'
    next();
  }

router.get('/chat', sessionOpen ,async(req,res) => {  
    const chats =  await chatmanagersMongo.getChats()
    res.render('chat', {chats , session: req.session ,  admin: res.locals.isAdmin})
})

router.post('/',  (req, res) => {
    try {
        const { user, message } = req.body;
        // Aquí deberías llamar a la función saveChats del manager, pasando user y message
         chatmanagersMongo.saveChats( user, message );

        // Puedes enviar una respuesta al cliente si lo deseas
        res.status(200).json({ success: true, message: 'Mensaje guardado correctamente' });
    } catch (error) {
        console.error('Error al guardar el mensaje:', error);
        res.status(500).json({ success: false, error: 'Error al guardar el mensaje' });
    }
});

export default router