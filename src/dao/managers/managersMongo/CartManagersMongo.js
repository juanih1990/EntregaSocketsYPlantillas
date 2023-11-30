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
            const carts = await CartMongo.find();
            return carts.map((cart) => {
                return {
                    _id: cart._id,
                    productos: cart.productos.map((producto) => {
                        if (producto && producto.pid && producto.pid._id) {
                            return {
                                _id: producto._id,
                                pid: {
                                    _id: producto.pid._id,
                                    title: producto.pid.title,
                                    price: producto.pid.price,
                                    category: producto.pid.category
                                },
                                quantity: producto.quantity,
                            };
                        } else {
                            // Manejar el caso cuando producto.pid o producto.pid._id es null
                            return null;
                        }
                    }).filter((producto) => producto !== null), // Filtrar elementos nulos
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
            console.log("try", productId)
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
            console.log("catch", productId)
            console.error('Error al crear o actualizar el carrito:', error);
            throw error; // Propaga el error para manejarlo en el router
        }
    }

    deleteCart = async (cid, pid) => {
        try {
            // Actualiza el carrito usando el operador $pull para eliminar el producto del array
            const result = await CartMongo.updateOne(
                { _id: cid },
                { $pull: { productos: { pid: pid } } }
            );

            if (result.nModified === 0) {
                // Si nModified es 0, significa que no se encontró el producto para eliminar
                throw new Error('Producto no encontrado en el carrito');
            }

            // El producto fue eliminado con éxito
            return { status: 'success' };
        } catch (error) {
            console.error('Error al eliminar el producto del carrito', error);
            throw new Error('Error interno del servidor');
        }
    }

    deleteTotalCarts = async (cid) => {
        try {
            const result = await CartMongo.updateOne(
                { _id: cid },
                { $set: { productos: [] } }
            )
            if (result.nModified === 0) {
                throw new Error("Carrito no encontrado")
            }
            return { status: 'success' }
        } catch (error) {
            throw new Error("Error interno del servidor")
        }
    }

    getCartDetail = async (cid) => {
        try {
            // Utiliza Mongoose para obtener el carrito por su _id
            const cart = await CartMongo.findById(cid).populate('productos.pid');

            if (!cart) {
                // Si no se encuentra el carrito, puedes manejar el error de alguna manera
                throw new Error('Carrito no encontrado');
            }

            // Devuelve el detalle del carrito
            return cart;
        } catch (error) {
            // Maneja cualquier error que ocurra durante la operación
            console.error('Error al obtener el detalle del carrito', error);
            throw new Error('Error interno del servidor');
        }
    }

    updateCantCart = async (cid, pid, operacion) => {
        try {
            const cart = await CartMongo.findById(cid);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const productoEnCarrito = cart.productos.find(producto => producto.pid.equals(pid));

            if (!productoEnCarrito) {
                throw new Error('Producto no encontrado en el carrito');
            }

            if (operacion === 'sumar') {
                productoEnCarrito.quantity += 1;
            } else if (operacion === 'restar') {
                if (productoEnCarrito.quantity > 1) {
                    productoEnCarrito.quantity -= 1;
                } else {
                    throw new Error('La cantidad mínima permitida es 1');
                }
            } else {
                throw new Error('Operación no válida');
            }

            await cart.save();

            return;
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito', error);
            throw error;
        }
    }

    getCartDetailProduct = async (cid, pid) => {
        try {
            const cart = await CartMongo.findOne({ _id: cid }).populate('productos.pid');
    
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
    
            const productoEnCarrito = cart.productos.find(producto => producto.pid.equals(pid))

            if (!productoEnCarrito) {
                throw new Error('Producto no encontrado en el carrito');
            }
    
            return productoEnCarrito
             
        } catch (error) {
            console.error('Error al obtener el detalle del producto en el carrito', error);
            throw error;
        }
    }
}

export default CardManagersMongo