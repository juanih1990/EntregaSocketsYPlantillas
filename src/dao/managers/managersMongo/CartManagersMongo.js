import CartMongo from '../../models/cart.model.js'
import ProductMongo from '../../models/products.model.js'
class CardManagersMongo {
    constructor() {
        this.cart = []
        this.product= []
    }

    getCart = async () => {
        this.cart = await CartMongo.find().lean().exec();
        this.product = await ProductMongo.find().lean().exec();
    
        const cartItems = this.cart.map(cartProduct => {
            const matchingProduct = this.product.find(product => product._id == cartProduct.productos[0].pid);
            if (matchingProduct) {
                matchingProduct.quantity = cartProduct.productos[0].quantity;
                return matchingProduct;
            }
        }).filter(Boolean);
    
        return cartItems;
    }
    createCart = async (id) => {
        console.log(id)
        //Esta la logica de agregar al carrito, en la vista me toma bien el id .

        // this.products = await ProductsMongo.find().lean().exec()
        this.cart = await CartMongo.find().lean().exec()  // Primero traigo mis productos de la base de datos para comparar codigo , y asi verificar si existe. ademas de validar datos

        // Buscar el producto en el carrito
        const existingProductIndex = this.cart.findIndex(product => product.productos[0].pid == id);

        if (existingProductIndex === -1) {
            //Si el producto no esta lo creo en el carrito
            const result = await CartMongo.create({
                productos: [
                    {
                        pid: id,
                        quantity: 1,
                    }
                ]
            })
            console.log(result + " se agrego un nuevo producto al carrito")
        }
        else {     
            //Si el producto esta, actualizo la cantidad en el carrito
            const cantidad  = this.cart[existingProductIndex].productos[0].quantity += 1;
            // Actualizar en la base de datos
            await CartMongo.updateOne(
                { _id: this.cart[existingProductIndex]._id, 'productos.pid': id },
                { $set: { 'productos.$.quantity': cantidad } }
            );
        }
    }
}
export default CardManagersMongo