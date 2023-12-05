import ProductsModel from "../../models/products.model.js"
class ProductManagerMongo {
    constructor() {
        this.products = []
    }
    listarProductos = async () => {
        this.products = await ProductsModel.find().lean().exec()
        return this.products
    }
    AgregarProductos = async (body) => {
        this.products = await ProductsModel.find().lean().exec()  // Primero traigo mis productos de la base de datos para comparar codigo 
                                                                    //, y asi verificar si existe. ademas de validar datos
        let existencia
        
        if (
            !body.title ||
            !body.price ||
            !body.description ||
            !body.code ||
            !body.stock ||
            !body.category
        ) {
            console.log("Se requiere completar todos los campos");
        }
        else {
            if (this.products.some(prod => prod.code == body.code)) {
                existencia = true  // Si el codigo existe cambio a true , para que no me guarde el archivo
                console.log("El producto con codigo " + this.products.code + " ya existe en la base de datos.")
            }
            else {
                //creo el producto
                const product = {
                    title: body.title,
                    description: body.description,
                    price: body.price,
                    thumbnail: body.thumbnail,
                    code: body.code,
                    stock: body.stock,
                    status: body.status !== undefined ? body.status : "true",
                    category: body.category
                }
                //agrego el producto
                const result = await ProductsModel.create(product)
                console.log(result + " se agrego un nuevo producto")
            }
        }
    }
    borrarProductos = async (ids) => {
        await ProductsModel.deleteOne({ _id: ids })
    }
}
export default ProductManagerMongo