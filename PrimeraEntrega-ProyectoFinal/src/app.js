const express = require('express')

const productsRouter = require('./routers/productsRouter')
const cardsRouter = require('./routers/cartsRouter')

const PORT = 8080

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res)=>{
    res.send('Primera entrega - Proyecto Final')
})

app.use('/api/products', productsRouter)
app.use('/api/cards', cardsRouter)

app.listen(PORT, () => {
    console.log(`Servidor Express en el puerto ${PORT} `);
})