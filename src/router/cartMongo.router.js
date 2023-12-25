import { Router } from 'express'
import CartManagerMongo from '../dao/managers/managersMongo/CartManagersMongo.js'
import CartModel from '../dao/models/cart.model.js'
import userModel from '../dao/models/user.model.js'
import passport from 'passport'


const router = Router()
const cartManagerMongo = new CartManagerMongo()




router.delete('/cart/:_id', async (req, res) => {
  try {
    const { _id } = req.params
    await cartManagerMongo.deleteTotalCarts(_id)
    return res.json({ status: "succes" })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.delete('/cart/:_id/products/:pid', async (req, res) => {
  try {
    const { _id, pid } = req.params
    await cartManagerMongo.deleteCart(_id, pid)
    return res.json({ status: "success" })
  } catch (error) {
    console.error('Error al eliminar el producto del carrito', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})


router.post(
  '/:pid',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { user } = req
      const { pid } = req.params

      const existingUser = await userModel.findById(user.user._id);


      if (existingUser.cart.length > 0) {
        const cartOpen = await CartModel.findOne({ finalizado: false , user: user.user._id })

        if (cartOpen !== null && (!cartOpen.finalizado)) {
          // Busca si el producto ya existe en el carrito
          const existingProduct = cartOpen.productos.find(
            (product) => product.pid.toString() === pid
          );
          if (existingProduct) {
            // Si el producto ya existe, incrementa la cantidad
            existingProduct.quantity += 1;
          } else {
            // Si el producto no existe, agrégalo al carrito con una cantidad de 1
            cartOpen.productos.push({
              pid: pid,
              quantity: 1,
            });
          }
          await cartOpen.save(); // Guarda los cambios en el carrito
          return res.redirect('/productos/listarProductos')
        }
      }

      // const newcart = await cartManagerMongo.createCart(pid)
      const newcart = new CartModel({
        user: existingUser._id,
        productos: [
          {
            pid: pid,
            quantity: 1,
          },
        ],
      });
      await newcart.save();
      const userId = existingUser._id;
      await userModel.findOneAndUpdate(
        { _id: userId },
        { $push: { cart: newcart._id } },
        { new: true }
      );

      res.redirect('/productos/listarProductos')
    } catch (error) {
      res.send('Error al agregar el producto al carrito' + error)
    }
  })

router.get(
  '/cart',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { user } = req;
 
      const existingUser = await userModel.findById(user.user._id).populate('cart').lean().exec()

      const matchCart = await CartModel.find({ user: user.user._id }).lean().exec()

      matchCart.forEach(cart => {
        if (existingUser.cart !== null && cart.user == user.user._id) {
          res.render('cart', { user: existingUser.cart });
        } else {
          res.render('cart', { user: null });
        }
      })

    } catch (error) {
      // Maneja cualquier error que ocurra durante la consulta
      res.send('Error al obtener el carrito: ' + error);
    }
  }
)

router.get(
  '/cart/:_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { _id } = req.params
    const result = await cartManagerMongo.getCart(_id)
    res.render('cartDetail', { user : result });
  });

router.get(
  '/cart/:_id/products/:pid',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { _id, pid } = req.params;

    const result = await cartManagerMongo.getCartDetailProduct(_id, pid)

    const { title, price, description, stock, thumbnail, code, category } = result.pid
    const { quantity } = result

    // Crear un nuevo objeto con las propiedades deseadas
    const producto = {
      pid,
      _id,
      title,
      price,
      description,
      quantity,
      stock,
      thumbnail,
      code,
      category
    };

    res.render('cartProductDetail', { user: producto })
  })

router.put('/cart/:_id', async (req, res) => {
  try {
    const { _id } = req.params
    const updateData = req.body // Esto contiene los datos enviados desde Postman

    const updatedCart = await CartMongo.findByIdAndUpdate(_id, updateData, { new: true })

    if (!updatedCart) {
      return res.status(404).json({ error: 'Carrito no encontrado' })
    }

    return res.json({ status: 'success', updatedCart });


  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

//este endpoint lo utilizo en  => Mostrar carrito => abrir carrito => Mostrar detalle => en esta vista podes cambiar la cantidad con el boton + o el boton - y lo va actualizando.
router.put('/cart/:_id/products/:pid', async (req, res) => {
  try {
    const { _id, pid } = req.params
    const { operacion } = req.query
    await cartManagerMongo.updateCantCart(_id, pid, operacion)    //actualizo la cantidad del producto en el carrito

    return res.json({ status: "success" })
  } catch (error) {
    console.error('Error al actualizar el producto del carrito', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

export default router