const fs = require('fs')

class ProductManager {
    constructor(path) {
        this.path = path
        this.iniciar()
    }

    iniciar() {
        if (!fs.existsSync(this.path)) {
            const contenido = []
            fs.writeFileSync(this.path, JSON.stringify(contenido))
        }
    }

    getProducts() {
        return fs.promises.readFile(this.path, 'utf-8')
            .then((productsString) => {
                const products = JSON.parse(productsString)
                return products
            })
            .catch((error) => {
                return []
            })
    }

 

    addProduct(data) {
        if (!data.title
            || !data.description
            || !data.code
            || !data.price
            || !data.status
            || !data.stock
            || !data.category) {
            throw 'Error: Campos incorrectos'
        }
        const product = {
            title: data.title,
            description: data.description,
            code: data.code,
            price: data.price,
            status: data.status,
            stock: data.stock,
            thumbnails: data.thumbnails,
        }
        return this.getProducts()
            .then((products) => {
                product.id = products.length + 1
                products.push(product)
                return fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))
                    .catch((error) => {
                        return 'Error: No se pudo guardar el archivo'
                    })
            })
            .catch((error) => {
                return 'Error: No se pudo leer el archivo'
            })
    }

    getProductById(id) {
        return this.getProducts()
            .then((products) => {
                const product = products.find(product => product.id === id)
                return product
            })
            .catch((error) => {
                return 'Error: no se puede obtener'
            })
    }

    updateProduct(id, data) {
        console.log('update')
        if (!data.title
            || !data.description
            || !data.code
            || !data.price
            || !data.status
            || !data.stock
            || !data.category) {
            return 'Error: Campos incorrectos'
        }
        return this.getProducts()
            .then((products) => {
                const productIndex = products.findIndex(product => product.id === id)
                if (productIndex !== -1) {
                    products[productIndex].title = data.title
                    products[productIndex].description = data.description
                    products[productIndex].code = data.code
                    products[productIndex].price = data.price
                    products[productIndex].status = data.status
                    products[productIndex].stock = data.stock
                    products[productIndex].thumbnail = data.thumbnail
                    return fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))
                }
            })
            .catch((error) => {
                return 'Error: No se pudo actualizar el producto'
            })
    }

    deleteProduct(id) {
        return this.getProducts()
            .then((products) => {
                const productIndex = products.findIndex(product => product.id === id)
                if (productIndex !== -1) {
                    products.splice(productIndex, 1)
                    return fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))
                } else {
                    console.log('no existe');
                    throw 'Error: No existe el producto'
                }
            })
            .catch((error) => {
                return 'Error: No se pudo eliminar el producto'
            })
    }

    clearProducts() {
        const products = []
        return fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))
            .then(() => { })
            .catch((error) => {
                return 'Error: No se pudo eliminar todos los productos del archivo'
            })
    }
}

module.exports = ProductManager