import { Database } from "./database/database.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
   {
      method: 'GET',
      path: buildRoutePath('/tasks'),
      handler: (req, res) => {
         const { search } = req.query
         const tasks = database.select('tasks', search ? {
            title: search, description: search
         } : null)
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
      method: 'PUT',
      path: buildRoutePath('/tasks/:id'),
      handler: (req, res) => {
         const { id } = req.params
         const { title, description } = req.body

         const updatedTask = {
            title,
            description
         }

         database.update('tasks', id, updatedTask)
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
      method: 'PATCH',
      path: buildRoutePath('/tasks/:id'),
      handler: (req, res) => {
         const { id } = req.params
         const task = database.select('tasks', null, id)
         const data = {
            iscomplete: true
         }
         console.log(task)
         database.update('tasks', id, data)

         return res.end(JSON.stringify(task))
      }
   },
]