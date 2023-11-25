import CartMongo from '../../models/cart.model.js'
import ProductMongo from '../../models/products.model.js'
import mongoose from 'mongoose'
class CardManagersMongo {
    constructor() {
        this.cart = []
        this.product = []
    }

    getCart = async () => {
        try {
            const carts = await CartMongo.find()

            return carts.map(cart => {
                return {
                    _id: cart._id,
                    productos: cart.productos.map(producto => {
                        return {
                            _id: producto._id,
                            pid: {
                                _id: producto.pid._id,
                                title: producto.pid.title,
                                price: producto.pid.price,
                            },
                            quantity: producto.quantity,
                        };
                    }),
                    // Agrega otros campos del carrito si los necesitas
                };
            });
        } catch (error) {
            console.error('Error al obtener carritos:', error);
            throw error; // Propaga el error para manejarlo en el router
        }
    }


    createCart = async (productId) => {
        try {
            //primera busqueda verifico si existe un carrito que cumpla con las dos condicion es decir que pid exista y finalizado sea = a false
            let activeCart = await CartMongo.findOne({ 'productos.pid': productId, finalizado: false });

            if (!activeCart) {

                //Si no cumple con las dos verifico que por lo menos finalizado sea = false
                activeCart = await CartMongo.findOne({ finalizado: false });

                if (activeCart) {       //si cumple con esto quiere decir que el carrtio todavia no tiene el producto lo agrego
                    activeCart.productos.push({
                        pid: productId,
                        quantity: 1,
                    });

                    // Guarda el carrito actualizado
                    const updatedCart = await activeCart.save();
                    return updatedCart;
                }
            } else { // Si el producto esta en el carrito y el carrito esta abierto le aumento la cantidad 

                const existingProduct = activeCart.productos.find(producto => producto.pid.equals(productId));

                if (existingProduct) {
                    // El producto existe, actualiza la cantidad utilizando updateOne
                    await CartMongo.updateOne(
                        { _id: activeCart._id, 'productos.pid': productId },
                        { $inc: { 'productos.$.quantity': 1 } }
                    );

                    // Obtén el carrito actualizado después de la actualización
                    const updatedCart = await CartMongo.findById(activeCart._id);
                    return updatedCart;
                }

            }

            // Si no hay ningun carrito.  es decir que no existe o no hay ningun finalizado = false .. creo el carro con su _id nuevo.
            const newCart = new CartMongo({
                productos: [
                    {
                        pid: productId,
                        quantity: 1,
                    },
                ],
            });

            // Guarda el nuevo carrito en la base de datos
            const savedCart = await newCart.save();
            return savedCart;

        } catch (error) {
            console.error('Error al crear o actualizar el carrito:', error);
            throw error; // Propaga el error para manejarlo en el router
        }
    }
}

export default CardManagersMongo