import http from 'node:http'
import { json } from './middlware/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'
import { csvParser } from './middlware/read-csv-file.js'

const port = 3001
const address = `http://localhost:${port}`

const server = http.createServer(async (req, res) => {
   const { method, url, headers } = req

   if (headers['content-type'].includes('text/csv' || 'multipart/form-data')) {
      await csvParser(req, res)
   } else {
      await json(req, res)
   }
   
   
   const route = routes.find(route => {
      return route.method === method && route.path.test(url)
   })

   if (route) {
      const routeParams = req.url.match(route.path)
      const { query, ...params } = routeParams.groups

      req.params = params
      req.query = query ? extractQueryParams(query) : {}
      
      return route.handler(req, res)
   }

   return res.writeHead(404).end('Not found')
})

server.listen(port)
console.log(`🔥 Server is running on ${address}`)