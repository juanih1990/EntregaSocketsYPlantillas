import { Router } from 'express'
import CartManagerMongo from '../dao/managers/managersMongo/CartManagersMongo.js'
import CartModel from '../dao/models/cart.model.js'
import session from 'express-session'

const router = Router()
const cartManagerMongo = new CartManagerMongo()

function sessionOpen(req, res, next) {
  res.locals.session = req.session;
  next();
}


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

//crea el carrito cuado dan click en agregar producto.  dentro de localhost:8080/productos
router.post('/:pid', async (req, res) => {
  try {
    const { pid } = req.params
    await cartManagerMongo.createCart(pid)
    res.redirect('/productos/listarProductos')
  } catch (error) {
    res.send('Error al agregar el producto al carrito' + error)
  }
})

router.get('/cart', sessionOpen ,async (req, res) => {
  const limit = parseInt(req.query?.limit ?? 4)
  const page = parseInt(req.query?.page ?? 1)
  const query = req.query?.query ?? ''
  const sortField = req.query?.sort ?? 'title';
  const sortOrder = req.query?.order ?? 'asc';
  const category = req.query?.category || '';
  const stockOnly = req.query?.stockOnly === 'true';
  const search = {}
  if (category) {
    search.category = category
  }

  if (stockOnly) {
    search.stock = { $gt: 0 }
  }

  if (query) search.title = { "$regex": query, "$options": "i" }


  const result = await CartModel.paginate(search, {
    page,
    limit,
    sort: { [sortField]: sortOrder },
    lean: true
  })


  result.cartItem = result.docs
  result.query = ""
  delete result.docs

  res.render('cart', { result })
})

router.get('/cart/:_id', sessionOpen , async (req, res) => {
    const { _id } = req.params;
    const result = await cartManagerMongo.getCart(_id)
    res.render('cartDetail', { result });
});

router.get('/cart/:_id/products/:pid' , sessionOpen , async(req,res) =>{
  const { _id , pid } = req.params;
  
  const result = await cartManagerMongo.getCartDetailProduct(_id,pid)

 
    const { title, price, description, stock, thumbnail, code, category } = result.pid

    const { quantity } = result

    // Crear un nuevo objeto con las propiedades deseadas
    const producto = {
      pid ,
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

    console.log(producto);
  
  res.render('cartProductDetail',  { producto } )
})

router.put('/cart/:_id', async (req, res) => {   // este endpoint lo deje para trabajarlo por posman por que no le vi mucho sentido para implementarlo en las vistas.   
  try {
    const { _id } = req.params
    const updateData = req.body // Esto contiene los datos enviados desde Postman

    const updatedCart = await CartMongo.findByIdAndUpdate(_id, updateData, { new: true })

    if (!updatedCart) {
      return res.status(404).json({ error: 'Carrito no encontrado' })
    }

    return res.json({ status: 'success', updatedCart });

    //en raw elegir el formato json y pasar algo asi 
    // en la ruta /cart/ aca va el id del carrito lo podes encontrar cuando das al boton mostrar carrito. te va a mostrar la id del mismo para que puedas copiar y pegarlo 
    /*{
      "productos": [
        {
          "pid": "id_del_producto",  en este campo pone la id del producto completo que quieras agregar al carrito.
          "quantity": 2
        },
        {
          "pid": "otro_id_de_producto",
          "quantity": 3
        }
      ],
      "finalizado": true
    }*/

  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

//este endpoint lo utilizo en  => Mostrar carrito => abrir carrito => Mostrar detalle => en esta vista podes cambiar la cantidad con el boton + o el boton - y lo va actualizando.
router.put('/cart/:_id/products/:pid', async (req, res) => {
  try {
    const { _id, pid } = req.params
    const { operacion } = req.query
    console.log(operacion ,  _id , pid)
    await cartManagerMongo.updateCantCart(_id,pid,operacion)    //actualizo la cantidad del producto en el carrito
    
    return res.json({ status: "success" })
  } catch (error) {
    console.error('Error al actualizar el producto del carrito', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

export default router