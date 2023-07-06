const { Router } = require('express')
const productManager = require('../ProductManager')

const productsRouter = Router()

const pathProducts = './productos.json'
const myProductManager = new productManager(pathProducts)

productsRouter.get('/', async (req, res) => {
    const products = await myProductManager.getProducts()
    const limit = req.query.limit
    if (!limit) {
        return res.send(products)
    } else {
        products.splice(limit, [...products].length)
        return res.send(products)
    }
})

productsRouter.get('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);
    const product = await myProductManager.getProductById(id)
    if (product !== undefined) {
        return res.send(product)
    }
    return res.send(`El producto con el código ${id} no existe`)
})

productsRouter.delete('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);
    try {
        await myProductManager.deleteProduct(id)
        return res.status(201).json({ Status: 'Ok' })
    } catch (error) {
        return res.status(404).json({ error: error })
    }
})

productsRouter.post('/', async (req, res) => {
    const product = req.body
    try {
        const status = await myProductManager.addProduct(product) || 'OK'
        return res.status(201).json({ status })
    } catch (error) {
        return res.status(404).json({ error: error })
    }
})

productsRouter.put('/:pid', async(req, res)=>{
    try {
        const data = req.body
        const id = parseInt(req.params.pid);
        const status = await myProductManager.updateProduct(id, data) || 'OK'
        console.log(status);
        return res.status(201).json({ status } ) 
    } catch (error) {
        return res.status(404).json({ error })
    }
})

module.exports = productsRouter