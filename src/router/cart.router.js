import { Router } from 'express';
import CartManager from '../cartManager.js'


const router = Router()
const cartManager = new CartManager()

//POST en post http://localhost:8080/api/carts
router.post('/', async (req, res) => {
    try {
        const cart = await cartManager.CrearCarrito()
        res.send(cart)
    }
    catch (error) {
        res.status(500).send(error)
    }
})
//POST en post ejecutar http://localhost:8080/api/carts/1/product/2
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid)
        const pid = parseInt(req.params.pid)

        const product = await cartManager.addProductCart(cid, pid)

        res.send(product)

    } catch (error) {
        res.status(500).send(error)
    }
})
//Get http://localhost:8080/api/carts
router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts()
        res.send(carts)

    } catch (error) {
        res.status(500).send(error)
    }
})
// Get  /:cid     http://localhost:8080/api/carts/2
router.get('/:cid', async (req, res) => {
    try {
        const id = parseInt(req.params.cid)
        const cart = await cartManager.getCartId(id)
        res.send(cart)
    } catch (error) {
        res.status(500).send(error)
    }
})

export default router