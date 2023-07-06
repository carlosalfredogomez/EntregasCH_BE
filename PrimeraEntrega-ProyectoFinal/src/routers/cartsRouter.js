const { Router } = require('express')
const cartManager = require('../CartManager')

const cartsRouter = Router()

const pathCarts = './carrito.json'
const myCartManager = new cartManager(pathCarts)

cartsRouter.get('/', async (req, res) => {
    const carts = await myCartManager.getCarts()
    const limit = req.query.limit
    if (!limit) {
        return res.send(carts)
    } else {
        carts.splice(limit, [...carts].length)
        return res.send(carts)
    }
})

cartsRouter.get('/:cid', async (req, res) => {
    const id = parseInt(req.params.cid);
    const cart = await myCartManager.getCartById(id)
    if (cart !== undefined) {
        return res.send(cart)
    }
    return res.send(`El producto con el código ${id} no existe`)
})

cartsRouter.post('/', async(req, res)=>{
    try {
        await myCartManager.addCart()
        return res.status(201).json({ Status: 'Ok' })
    } catch (error) {
        return res.status(404).json({ error: error })
    }
})

cartsRouter.post('/:cid/product/:pid', async(req, res)=>{
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);
        const status = await myCartManager.updateCart(cid, pid)
        console.log(status);
        return res.status(201).json({ status })
    } catch (error) {
        return res.status(404).json({ error: error })
    }
})

module.exports = cartsRouter