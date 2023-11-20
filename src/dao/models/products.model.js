import mongoose from 'mongoose'

const productsCollection = 'productos'

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    price: {
        type: Number 
    },
    description: {
        type: String
    },
    code: {
        type: String,
        unique: true
    },
    thumbnail:{
        type: String
    },
    stock: {
        type: Number
    },
    status: {
        type: Boolean
    },
    category: {
        type: String
    },
})

const ProductsMongo = mongoose.model(productsCollection,productsSchema)

export default ProductsMongo