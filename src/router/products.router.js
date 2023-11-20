import { Router } from 'express';
import ProductManager from '../dao/managers/ProductManager.js'; // Asegúrate de proporcionar la ruta correcta
import multer from 'multer'
import { Socket } from 'socket.io';

const router = Router();
const productManager = new ProductManager();

//configuracion de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/public')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const uploader = multer({ storage })



// Ruta GET para obtener productos con límite (por ejemplo, /api/products?limit=2) o todos los productos /api/products
router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit); // Obtener el valor del parámetro "limit" de la consulta
  try {
    const products = await productManager.getProduct();

    if (isNaN(limit) || limit <= 0) {
      // Si no se proporciona un valor válido para "limit", o si es menor o igual a 0, se devuelven todos los productos.
      res.send(products);
    } else {
      // Limitar la cantidad de productos según el valor de "limit"
      const limitedProducts = products.slice(0, limit);
      res.send(limitedProducts);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
})

//Ruta GET 127.0.0.1:8080/api/products
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const producto = await productManager.getProductByid(id)
    res.send(producto)
  } catch (err) {
    res.status(500).send("Error al obtener el producto: " + err)
  }
})

//Ruta POST 127.0.0.1:8080/api/products
router.post('/', uploader.single('thumbnail'), async (req, res) => {
  try {
    const data = req.body
    if (req.file) {
      const filename = req.file.filename
      data.thumbnail = `http://localhost:8080/${filename}`
    }
    const producto = await productManager.addProduct(data)
    res.send(producto)

    const products = await productManager.getProduct();
    // Accede a io a través de app.get
    const io = req.app.get('io');
    if (io) {
      io.emit('updateProducto', products);
    }
  } catch (error) {
    res.status(500).send(error)
  }

})


//Ruta PUT 127.0.0.1:8080/api/products/1
router.put('/:id', uploader.single('thumbnail'), async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const data = req.body

    if (req.file) {
      const filename = req.file.filename
      data.thumbnail = `http://localhost:8080/images/${filename}`
    }

    const producto = await productManager.updateProduct(id, data)
    res.send(producto)

    const products = await productManager.getProduct();
    // Accede a io a través de app.get
    const io = req.app.get('io');
    if (io) {
      io.emit('updateProducto', products);
    }
  } catch (error) {
    res.status(500).send(error)
  }
})

//Ruta DELETE 127.0.0.1:8080/api/products/1
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const borrado = await productManager.deleteProduct(id)
    res.send(borrado)

    const products = await productManager.getProduct();
    // Accede a io a través de app.get
    const io = req.app.get('io');
    if (io) {
      io.emit('updateProducto', products);
    }
  } catch (error) {
    res.status(500).send(error)
  }
})

export default router