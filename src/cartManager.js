import { response } from 'express'
import fs from 'fs'
import { resolve } from 'path';
import ProductManager from './ProductManager.js'
const productManager = new ProductManager()

class CartManager {
    constructor() {
        this.path = './carts.json',
            this.carts = []
    }

    CrearCarrito = () => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!fs.existsSync(this.path)) {
                    const cart = {
                        id: this.carts.length + 1,
                        productos: []
                    };
                    this.carts.push(cart);

                    const productAjson = JSON.stringify(this.carts, null, 2);
                    fs.promises.writeFile(this.path, productAjson)
                        .then(() => {
                            resolve("Gracias por su compra");
                        })
                        .catch((error) => {
                            reject(error)
                        })
                }
                else {
                    const data = await fs.promises.readFile(this.path, 'utf-8')
                    this.carts = JSON.parse(data)
                    const newCart = {
                        id: this.carts.length + 1,
                        productos: []
                    }

                    this.carts.push(newCart)
                    fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '\t'))
                        .then(() => {
                            resolve("Se agrego un nuevo producto al carrito")
                        })
                        .catch((error) => {
                            reject(error)
                        })
                }
            } catch (error) {
                reject(error)
            }
        });
    }
    addProductCart = (cid, pid) => {
        return new Promise(async (resolve, reject) => {
            try {

                if (!fs.existsSync(this.path)) {
                    await this.CrearCarrito()
                }

                const dataCart = await fs.promises.readFile(this.path, 'utf-8')
                this.carts = JSON.parse(dataCart)

                const carrito = this.carts.find(cart => cart.id === Number(cid))
                const producto = await productManager.getProductByid(pid)

                if (!producto) {
                    throw new Error("Producto no encontrado")
                }

                const prod = carrito.productos.find(c => c.pid === pid)

                if (prod) {
                    prod.quantity++
                    resolve("Se aumento la existencia del producto")
                }
                else {
                    carrito.productos.push({
                        pid: pid,
                        quantity: 1
                    })
                }
                fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '\t'))
                    .then(() => {
                        resolve("Se agrego un nuevo producto al carrito")
                    })
                    .catch((error) => {
                        reject(error)
                    })

            } catch (error) {
                reject(error)
            }
        })
    }
    getCarts = () => {
        return new Promise(async (resolve, reject) => {
            try {
                if (fs.existsSync(this.path)) {
                    const data = await fs.promises.readFile(this.path, 'utf-8')
                    this.carts = JSON.parse(data)
                    resolve(this.carts)
                }
                else {
                    reject("No hay productos en el carrito, comienza a comprar...")
                }
            } catch (error) {
                reject(error)
            }
        })
    }
    getCartId = (cid) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (fs.existsSync(this.path)) {
                    const data = await fs.promises.readFile(this.path, 'utf-8')
                    this.carts = JSON.parse(data)
                    const filterId = this.carts.findIndex(cart => cart.id === Number(cid))
                    resolve(this.carts[filterId])
                }
                else {
                    reject("Error: el carrito con id " + cid + " no existe")
                }
            } catch (error) {
                reject(error)
            }
        })
    }
}
export default CartManager