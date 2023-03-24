import { Database } from "./database/database.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
   {
      method: 'GET',
      path: buildRoutePath('/tasks'),
      handler: (req, res) => {
         const tasks = database.select('tasks')
         return res.end(JSON.stringify(tasks))
      }
   },

   {
      method: 'POST',
      path: buildRoutePath('/tasks'),
      handler: (req, res) => {
         if (req.body) {
            const { title, description } = req.body

            const newTask = {
               id: randomUUID(),
               title,
               description,
               iscomplete: false,
               completed_at: null,
               created_at: new Date(),
               updated_at: new Date()
            }

            console.log(newTask)
            database.insert('tasks', newTask)
            return res.writeHead(201).end(JSON.stringify(newTask))
         }
         return res.writeHead(400).end('Something went wrong')
      }
   },

   {
      method: 'UPDATE',
      path: buildRoutePath('/tasks/:id'),
      handler: (req, res) => {
         return res.end()
      }
   },

   {
      method: 'DELETE',
      path: buildRoutePath('/tasks/:id'),
      handler: (req, res) => {
         const { id } = req.params
         database.delete('tasks', id)
         return res.writeHead(204).end()
      }
   },

   {
      method: '',
      path: buildRoutePath(''),
      handler: (req, res) => {
         return res.end()
      }
   },
]