import http from 'node:http'
import { json } from './middlware/json.js'
import { routes } from './routes.js'

const port = 3001
const address = `http://localhost:${port}`

const server = http.createServer(async (req, res) => {
   const { method, url, headers } = req
   const route = routes.find(route => {
      return route.method === method && route.path === url
   })

   await json(req, res)

   if (route) {
      return route.handler(req, res)
   }

   return res.writeHead(404).end('Not found')
})

server.listen(port)
console.log(`🔥 Server is running on ${address}`)