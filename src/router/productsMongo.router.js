import { Router } from 'express'
import ProductsModel from '../dao/models/products.model.js'
import ProductManagerMongo from "../dao/managers/managersMongo/ProductManagersMongo.js"
import ProductsMongo from '../dao/models/products.model.js'

const router = Router()
const productManagerMongo = new ProductManagerMongo()


router.post('/', (req, res) => {
  try {
    const newProduct = req.body
    productManagerMongo.AgregarProductos(newProduct)
    res.redirect('/productos')
  } catch (error) {
    res.send('Error al crear el producto' + error)
  }
})

router.get('/', async (req, res) => {
  //aca voy a hacer la paginacion
  const limit = parseInt(req.query?.limit ?? 4)
  const page = parseInt(req.query?.page ?? 1)
  const query = req.query?.query ?? ''
  const sortField = req.query?.sort ?? 'title'
  const sortOrder = req.query?.order ?? 'asc'
  const category = req.query?.category || ''
  const stockOnly = req.query?.stockOnly === 'true'


  const search = {}
  console.log("categoria: " + category)
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

  res.render('home', { result })
})

router.get("/nuevoProducto", async (req, res) => {
  res.render('create', {})
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