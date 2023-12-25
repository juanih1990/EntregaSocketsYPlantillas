import { Router } from 'express'
import ProductManagerMongo from "../dao/managers/managersMongo/ProductManagersMongo.js"
import ProductsMongo from '../dao/models/products.model.js'
import passport from 'passport'


const router = Router()
const productManagerMongo = new ProductManagerMongo()



router.post(
  '/',
  async (req, res) => {
    try {
      const newProduct = req.body
      await productManagerMongo.AgregarProductos(newProduct)
      res.redirect('/productos/listarProductos')
    } catch (error) {
      res.send('Error al crear el producto' + error)
    }
  })

router.get(
  '/listarProductos',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user } = req
    let admin = false
    if (user.user.email == "admin@gmail.com" && user.user.password == "admin1234") {
      admin = true
    }
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


    //Lo hago para crear los <li> dentro de la paginacion debajo de los productos
    var paginas = result.totalPages;
    var PaginationDocs = [];
    for (var i = 1; i < paginas + 1; i++) {
      PaginationDocs.push(i);
    }

    ////////////////////////////////////////
    res.render('home', { result, session: req.session, admin: admin, Paginacion: PaginationDocs, user })
  })

router.get(
  "/nuevoProducto",
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user } = req
    let admin = false
    if (user.user.email == "admin@gmail.com" && user.user.password == "admin1234") {
      admin = true
    }
    if (admin) {
      res.render('create', { admin: admin })
    }
    else {
      return res.render('errorSession', { admin })
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