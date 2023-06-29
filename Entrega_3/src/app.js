const express = require('express')
const productManager = require('./ProductManager')

const path = './products.json'
const PORT = 8080
const myProductManager = new productManager(path)

const app = express()

app.get('/', (req, res)=>{
    res.send('Servidor con Express Clase 6')
})

app.get('/products/', async(req, res)=>{
    const products = await myProductManager.getProducts()
    const limit = req.query.limit
    if (!limit){
        return res.send(products)
    }else{
        products.splice(limit, [...products].length)
        return res.send(products)
    }
})

app.get('/products/:id', async(req, res)=>{
    const products = await myProductManager.getProducts()
    const id = parseInt(req.params.id);
    const product = await myProductManager.getProductById(id)
    if (product !== undefined){
        return res.send(product)
    }
    return res.send(`El producto con el código ${id} no existe`)
})

app.listen(PORT, () => {
    console.log(`Servidor Express en el puerto ${PORT} `);
})