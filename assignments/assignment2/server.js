const express = require('express')
const app = express()

app.use('/users', (req, res, next) => {
    console.log('Middleware 1')
    res.send('<h1>Hello from users</h1>')
})
app.use('/', (req, res, next) => {
    console.log('Middleware 2')
    res.send('<h1>Hello from Express.js</h1>')
})

app.listen(4000, () => {
    console.log('App is running on 4000')
})