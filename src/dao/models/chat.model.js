import mongoose from 'mongoose'
const chatCollection = 'messages'
const chatSchema = new mongoose.Schema({
    user: {
        type: String,   
    },
    messages: [
        {
            text: {
                type: String,   
            },
        },
    ],
});
const chatMongo = mongoose.model(chatCollection,chatSchema)

export default chatMongo