import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

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
productsSchema.plugin(mongoosePaginate)
const ProductsMongo = mongoose.model(productsCollection,productsSchema)

export default ProductsMongo