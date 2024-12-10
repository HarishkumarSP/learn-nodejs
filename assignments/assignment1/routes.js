const fs = require('fs')

const requestHandler = (req, res) => {
    const url = req.url
    const method = req.method
    if (url === '/') {
        res.write('<html>')
        res.write('<head><title>Nodejs app</title></head>')
        res.write('<body><h1>Hello from Nodejs server</h1><form action="/create-user" method="POST"><input type="text" name="username" /><button type="submit">Submit</button></form><a href="/users">view users</a></body>')
        res.write('</html>')
        return res.end();
    }
    if (url === '/users') {
        res.write('<html>')
        res.write('<head><title>Enter message</title></head>')
        res.write('<body><ul><li>user 1</li><li>user 2</li><li>user 3</li></ul></body>')
        res.write('</html>')
        return res.end();
    }
    if (url === '/create-user' && method === 'POST') {
        const body = []
        req.on('data', (chunk) => {
            console.log(chunk)
            body.push(chunk)
        }
        )
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString()
            console.log(parsedBody)
            const message = parsedBody.split('=')[1]
            fs.writeFile('message.txt', message, (err) => {
                res.statusCode = 302
                res.setHeader('Location', '/')
                return res.end()
            })
        })
    }
    res.setHeader('Content-Type', 'text/html')
    res.write('<html>')
    res.write('<head><title>Nodejs server</title></head>')
    res.write('<body><h1>Hello from Nodejs server</h1></body>')
    res.write('</html>')
    res.end();
}

module.exports = requestHandler


// Types of module exports
// exports.handler = requestHandler // shortcut we can use like this only used for names export not exports = request;

// module.exports = {
//     handler: requestHandler
// } // we can export like this also with named

// module.exports.handler = requestHandler // we can export like this also with named
