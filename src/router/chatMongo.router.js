import express from "express"
import chatManagersMongo from "../dao/managers/managersMongo/chatManagersMongo.js"
import passport from 'passport'

const router = express.Router()

const chatmanagersMongo = new chatManagersMongo()



router.get(
    '/chat',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        const { user } = req
        let admin = false
        if (user.user.email == "admin@gmail.com" && user.user.password == "admin1234") {
            admin = true
        }
        const chats = await chatmanagersMongo.getChats()
        res.render('chat', { chats, session: req.session, admin: admin })
    })

router.post('/', (req, res) => {
    try {
        const { user, message } = req.body;
        // Aquí deberías llamar a la función saveChats del manager, pasando user y message
        chatmanagersMongo.saveChats(user, message);

        // Puedes enviar una respuesta al cliente si lo deseas
        res.status(200).json({ success: true, message: 'Mensaje guardado correctamente' });
    } catch (error) {
        console.error('Error al guardar el mensaje:', error);
        res.status(500).json({ success: false, error: 'Error al guardar el mensaje' });
    }
});

export default router