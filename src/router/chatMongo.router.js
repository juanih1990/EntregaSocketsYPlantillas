import express  from "express"
import chatManagersMongo from "../dao/managers/managersMongo/chatManagersMongo.js"

const router = express.Router()

const chatmanagersMongo = new chatManagersMongo()

router.get('/' ,async(req,res) => {  
    const chats =  await chatmanagersMongo.getChats()
    res.render('chat', {chats})
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