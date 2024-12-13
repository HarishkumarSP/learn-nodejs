const express = require('express')
const path = require('path')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.sendFile(path.resolve('assignments/assignment3/views/shop.html'))
})

module.exports = router