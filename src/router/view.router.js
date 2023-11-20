import { Router } from 'express'
import ProductManager from '../dao/managers/ProductManager.js' 
const router = Router()

const productManager = new ProductManager();


router.get('/',async (req, res) => {
    const products = await productManager.getProduct()
    res.render('home', {
        products
    })
})

router.get('/realTimeProducts',async (req, res) => {
    const products = await productManager.getProduct()
    res.render('realTimeProducts',{
        products
    })
})

export default router