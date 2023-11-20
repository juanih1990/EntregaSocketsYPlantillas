import chatModel from '../../models/chat.model.js'

class chatManagersMongo {
    constructor() {
        this.chats = []
    }

    getChats = async () => {
        const chat = await chatModel.findOne().lean().exec();
        return chat
    }

    saveChats = async (users, mensaje) => {
        try {
            // Verificar si el usuario existe
            const existingUser = await chatModel.findOne({ user: users.user }).lean().exec();
            console.log("asasa: " + users)
            if (!existingUser) {
                // Si el usuario no está, lo creo en la base de datos 
                const result = await chatModel.create({
                    user: users.user,
                    messages: [{ text: mensaje }],
                });
                console.log(result + " se agregó un nuevo chat");
            } else {
                // El usuario ya existe, actualizar en la base de datos
                console.log("5" + mensaje)
    
                // Actualizar en la base de datos
                await chatModel.updateOne(
                    { user: users.user },
                    { $push: { messages: { text: mensaje } } }
                );
                console.log("Se agregó un nuevo mensaje al chat existente");
            }
        }
        catch (error) {
            console.error('Error al guardar el mensaje:', error);
        }
    }
}
export default chatManagersMongo