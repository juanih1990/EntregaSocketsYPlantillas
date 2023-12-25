import mongoose from "mongoose";

const sessionModel =mongoose.model('users' , new mongoose.Schema({
    firest_name: String,
    last_name: String,
    age_name: Number,
    email: String,
    password: String,
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cart',
        default: []
    }],
    role:{
        type: String,
        default : 'user'
    }
}))
export default sessionModel