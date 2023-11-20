import mongoose from 'mongoose'
const cartCollection = 'cart'
const cartSchema =  new mongoose.Schema({
        productos:[
            {
                pid: {
                    type:  String,
                    unique: true
                },
                quantity:{
                    type: Number
                }

            }
        ]

})
const CartMongo = mongoose.model(cartCollection,cartSchema)

export default CartMongo