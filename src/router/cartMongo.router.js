import { Router } from 'express'
import CartManagerMongo  from '../dao/managers/managersMongo/CartManagersMongo.js'
//import ProductManagerMongo from "../dao/managers/managersMongo/ProductManagersMongo.js"


const router = Router()
//const productManagerMongo = new ProductManagerMongo()
const cartManagerMongo = new CartManagerMongo()


router.post('/:id' , (req,res) => {
    try {  
      const {id} = req.params
      cartManagerMongo.createCart(id)
      res.redirect('/productos')
    } catch (error) {
      res.send('Error al agregar el producto al carrito'  +  error)
    }
       
})
router.get('/cart' , async (req,res) => {
    const cartItem = await cartManagerMongo.getCart()
    console.log(cartItem)
    res.render('home' ,  {cartItem} )
})
  export default router