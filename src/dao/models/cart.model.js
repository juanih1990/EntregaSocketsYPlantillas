import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const cartCollection = 'cart'
const cartSchema = new mongoose.Schema({
    productos: [
        {
            pid: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'productos', // Referencia al modelo de productos
                required: true,
            },
            quantity: {
                type: Number,
                default: 1, // por defecto un producto
            },
            default: [],
        },
    ],
    finalizado: {
        type: Boolean,
        default: false, // Por defecto, un carrito no está finalizado
    },
})
cartSchema.pre('find' , function() {
    this.populate('productos.pid')
})

cartSchema.plugin(mongoosePaginate)

const CartMongo = mongoose.model(cartCollection, cartSchema)

export default CartMongo