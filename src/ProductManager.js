import fs from 'fs'

class ProductManager {

    constructor() {
        this.products = []
        this.path = './productos.json'
    }

    addTofile = (param) => {
        const productAjson = JSON.stringify(param, null, 2);
        return fs.promises.writeFile(this.path, productAjson);
    }
    addProduct = async (newProduct) => {

        //Creo la variable para verificar si el codigo existe
        let existe = false
        //Verifico si el archivo existe
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.products = JSON.parse(data)

            if (this.products.some(prod => prod.code == newProduct.code)) {
                existe = true  // Si el codigo existe cambio a true , para que no me guarde el archivo
            }

            //creo el producto
            const product = {
                id: this.products.length + 1,
                title: newProduct.title,
                description: newProduct.description,
                price: newProduct.price,
                thumbnail: newProduct.thumbnail,
                code: newProduct.code,
                stock: newProduct.stock,
                status: newProduct.status !== undefined ? newProduct.status : "true",
                category: newProduct.category
            }
            //Agrego el producto al array
            this.products.push(product)
        }



        return new Promise((resolve, reject) => {
            if (
                !newProduct.title ||
                !newProduct.price ||
                !newProduct.description ||
                !newProduct.code ||
                !newProduct.stock ||
                !newProduct.category
            ) {
                reject("Se requiere completar todos los campos");
            }
            if (!fs.existsSync(this.path)) {
                this.products.push({
                    title: newProduct.title,
                    price: newProduct.price,
                    description: newProduct.description,
                    thumbnail: newProduct.thumbnail,
                    code: newProduct.code,
                    stock: newProduct.stock,
                    status: newProduct.status !== undefined ? newProduct.status : "true",
                    category: newProduct.category,
                    id: this.products.length + 1
                });
            }


            if (!existe) {
                this.addTofile(this.products)
                    .then(() => {
                        resolve("Producto guardado en archivo");
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }
            else {
                reject("El producto ya esta en existencia")
            }

        });
    }
    getProduct = () => {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(this.path)) {
                fs.promises.readFile(this.path, 'utf-8')
                    .then((data) => {
                        const products = JSON.parse(data);
                        resolve(products);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            } else {
                reject("El archivo no existe");
            }
        });
    }
    getProductByid = (id) => {
        return new Promise((resolve, reject) => {
            fs.promises.readFile(this.path, 'utf-8')
                .then((data) => {
                    const filterJson = JSON.parse(data)
                    const filter = filterJson.find(prod => prod.id === Number(id));

                    if (filter) {
                        resolve(filter)
                    } else {
                        reject("El producto no esta en el archivo")
                    }
                })
                .catch((error) => {
                    console.log(error)
                });
        })

    }
    updateProduct = (id, actualizar) => {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(this.path)) {
                fs.promises.readFile(this.path, 'utf-8')
                    .then((data) => {
                        const actualiza = JSON.parse(data)
                        const updateProduct = actualiza.findIndex(prod => prod.id === Number(id))
                        if (updateProduct !== -1) {
                            actualiza[updateProduct] = { ...actualiza[updateProduct], ...actualizar }
                            this.addTofile(actualiza)
                                .then(() => {
                                    resolve("Producto actualizado");
                                })
                                .catch((error) => {
                                    reject(error);
                                });
                        }
                        else {
                            reject("El producto no se encuentra en existencia")
                        }
                    })
            }
            else {
                reject("Por el momento no hay productos cargados ...")
            }
        })
    }
    deleteProduct = (id) => {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(this.path)) {
                fs.promises.readFile(this.path, 'utf-8')
                    .then((data) => {
                        const products = JSON.parse(data)
                        const existe = products.some(prod => prod.id === Number(id))
                        if (!existe) {
                            reject("El producto que desea eliminar no esta en existencia")
                        }
                        const filtrar = products.filter((prod) => prod.id !== Number(id))
                        this.addTofile(filtrar)
                            .then(() => {
                                resolve("Producto eliminado");
                            })
                            .catch((error) => {
                                reject(error);
                            });
                    })
            }
        })
    }
}
export default ProductManager