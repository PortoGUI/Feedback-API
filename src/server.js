const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000
const secretKey = process.env.SECRET_KEY || 'yek_terces'

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

const routes = require('./routes')
app.use('/', routes)

app.listen(port, () => {
  console.log('')
  console.log(`Server iniciado na porta: \x1b[33m${port}\x1b[0m`)
  console.log(`Ping: \x1b[34mhttp://localhost:${port}/ping\x1b[0m`)
  console.log(`\x1b[35m${secretKey}\x1b[0m`)
})
