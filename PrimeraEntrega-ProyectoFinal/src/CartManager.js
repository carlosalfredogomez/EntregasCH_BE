const fs = require('fs')

class CartManager {
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

    getCarts() {
        return fs.promises.readFile(this.path, 'utf-8')
            .then((cartsString) => {
                const carts = JSON.parse(cartsString)
                return carts
            })
            .catch((error) => {
                return []
            })
    }

    addCart() {
        const cart = {
            products: []
        }
        return this.getCarts()
            .then((carts) => {
                cart.id = carts.length + 1
                carts.push(cart)
                return fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
                    .catch((error) => {
                        return 'Error: No se pudo guardar el archivo'
                    })
            })
            .catch((error) => {
                return 'Error: No se pudo leer el archivo de usuarios'
            })
    }

    getCartById(id) {
        return this.getCarts()
            .then((carts) => {
                const cart = carts.find(cart => cart.id === id)
                return cart
            })
            .catch((error) => {
                return 'Error: No existe la cart'
            })
    }

    updateCart(cid, pid) {
        return this.getCarts()
            .then((carts) => {
                const cartIndex = carts.findIndex(cart => cart.id === cid)
                if (cartIndex !== -1) { //SI EXISTE EL cart
                    //TOMAR EL ARRAY DE PRODUCTOS DEL CART
                    const products = carts[cartIndex].products
                    //BUSCAR EN EL ARRAY DE PRODUCTOS EL NUEVO PRODUCTO
                    let product = products.find(p=>p.id === pid)
                    if (product === undefined){
                        product = {
                            id: pid,
                            quantity: 1
                        }    
                        //SE AGREGA EL NUEVO PRODUCTO
                        carts[cartIndex].products.push(product)
                    }else{
                        //SI EXISTE, SE ACTUALIZA LA CANTIDAD
                        product.quantity = product.quantity + 1
                    }
                    fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
                    return 'Ok'
                }else{
                    return 'Error: No existe el carrito'
                }
            })
            .catch((error) => {
                return 'Error: No se pudo actualizar el carrito'
            })
    }

    deleteCart(id) {
        return this.getCarts()
            .then((carts) => {
                const cartIndex = carts.findIndex(cart => cart.id === id)
                if (cartIndex !== -1) {
                    carts.splice(cartIndex, 1)
                    return fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
                }
            })
            .catch((error) => {
                return 'Error: No se pudo eliminar la cart'
            })
    }

    clearProducts() {
        const carts = []
        return fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
            .then(() => { })
            .catch((error) => {
                return 'Error: No se pudo eliminar todos los elementos archivo'
            })
    }
}

module.exports = CartManager