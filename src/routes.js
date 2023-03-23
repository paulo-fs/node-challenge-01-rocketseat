import { Database } from "./database/database.js"
import { randomUUID } from 'node:crypto'

export const routes = [
   {
      method: 'GET',
      path: '/tasks',
      handler: (req, res) => {
         console.log('tasks')
         return res.end()
      }
   },

   {
      method: '',
      path: '',
      handler: (req, res) => {
         console.log('erro')
         return res.end()
      }
   },

   {
      method: '',
      path: '',
      handler: (req, res) => {
         return res.end()
      }
   },
]