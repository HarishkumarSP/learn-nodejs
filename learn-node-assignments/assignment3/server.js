const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()

const shopRoutes = require('./routes/shop')
const userRoutes = require('./routes/users')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))

app.use(shopRoutes)
app.use(userRoutes)

app.use((req, res) => {
    res.status(404).sendFile(path.resolve('views/404.html'))
})

app.listen(4000, () => {
    console.log('App is running on 4000')
})