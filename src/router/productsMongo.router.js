import { Router } from 'express'
import ProductsModel from '../dao/models/products.model.js'
import ProductManagerMongo from "../dao/managers/managersMongo/ProductManagersMongo.js"


const router = Router();
const productManagerMongo = new ProductManagerMongo();


router.post('/' , (req,res) => {
  try {
    const newProduct = req.body
    productManagerMongo.AgregarProductos(newProduct)
    res.redirect('/productos')
  } catch (error) {
    res.send('Error al crear el producto'  +  error)
  }
     
})

router.get('/', async (req, res) => {
    const Productos = await productManagerMongo.listarProductos()
    res.render('home' ,  {Productos} )
})

router.get("/nuevoProducto" , async(req,res) => {
    res.render('create' , {})
})

router.delete("/:id" , async (req,res) => {
    try { 
        const {id} = req.params
        productManagerMongo.borrarProductos(id)
        return res.json({status: "success"})
    } catch (error) {
        res.status(500).json(error)
    }
})

export default router