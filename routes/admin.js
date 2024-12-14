const express = require('express')
const path = require('path')
const router = express.Router()

router.get('/add-product', (req, res, next) => {
    res.sendFile(path.resolve('views/add-product.html'))
})

router.post('/add-product', (req, res, next) => {
    console.log(req.body)
    console.log(req.body.title)
    res.redirect('/')
})

module.exports = router