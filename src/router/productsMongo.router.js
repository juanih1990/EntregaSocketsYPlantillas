import { Router } from 'express'
import ProductsModel from '../dao/models/products.model.js'
import ProductManagerMongo from "../dao/managers/managersMongo/ProductManagersMongo.js"
import ProductsMongo from '../dao/models/products.model.js'
import session from 'express-session'


const router = Router()
const productManagerMongo = new ProductManagerMongo()


function sessionOpen(req, res, next) {
  res.locals.session = req.session;
  res.locals.isAdmin = req.session?.user?.email === 'admin@gmail.com' && req.session?.user?.password === 'admin1234'
  next();
}

router.post('/', (req, res) => {
  try {
    console.log("entro a agregar")
    const newProduct = req.body
    productManagerMongo.AgregarProductos(newProduct)
    res.redirect('/productos/listarProductos')
  } catch (error) {
    res.send('Error al crear el producto' + error)
  }
})

router.get('/listarProductos', sessionOpen ,   async (req, res) => {
  const limit = parseInt(req.query?.limit ?? 4)
  const page = parseInt(req.query?.page ?? 1)
  const query = req.query?.query ?? ''
  const sortField = req.query?.sort ?? 'title'
  const sortOrder = req.query?.order ?? 'asc'
  const category = req.query?.category || ''
  const stockOnly = req.query?.stockOnly === 'true'

  

  const search = {}

  if (category) {
    search.category = category
  }

  if (stockOnly) {
    search.stock = { $gt: 0 }
  }

  if (query) search.title = { "$regex": query, "$options": "i" }

  const result = await ProductsMongo.paginate(search, {
    page,
    limit,
    sort: { [sortField]: sortOrder },
    lean: true
  })

  result.Productos = result.docs
  result.query = ""
  delete result.docs
  res.render('home', { result , session: req.session  , admin: res.locals.isAdmin }) 
})

router.get("/nuevoProducto", sessionOpen ,   async (req, res) => {

  if(res.locals.isAdmin){
    res.render('create', {admin: res.locals.isAdmin})
  }
  else{
    return res.render('errorSession' , { admin } ) 
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params
    productManagerMongo.borrarProductos(id)
    return res.json({ status: "success" })
  } catch (error) {
    res.status(500).json(error)
  }
})

export default router