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
      method: 'GET',
      path: buildRoutePath('/tasks/:id'),
      handler: (req, res) => {
         const { id } = req.params
         const task = database.select('tasks', null, id)

         if (task === 404) {
            return res.writeHead(404).end('No task found')
         }

         return res.end(JSON.stringify(task))
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

            database.insert('tasks', newTask)
            return res.writeHead(201).end(JSON.stringify(newTask))
         }
         return res.writeHead(400).end('Something went wrong')
      }
   },

   {
      method: 'POST',
      path: buildRoutePath('/tasks/upload'),
      handler: (req, res) => {
         const { body } = req

         try {
            body.forEach(task => {
               const { title, description } = task
   
               const newTask = {
                  id: randomUUID(),
                  title,
                  description,
                  iscomplete: false,
                  completed_at: null,
                  created_at: new Date(),
                  updated_at: new Date()
               }
   
               database.insert('tasks', newTask)
            })
         } catch (err) {
            console.log(err)
         }

         return res.writeHead(204).end()
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

         const result = database.update('tasks', id, updatedTask)

         if (result === 404) {
            return res.writeHead(404).end('Task not found')
         }

         return res.end()
      }
   },

   {
      method: 'DELETE',
      path: buildRoutePath('/tasks/:id'),
      handler: (req, res) => {
         const { id } = req.params
         const result = database.delete('tasks', id)
         
         if (result === 404) {
            return res.writeHead(404).end('Task not found')
         }

         return res.writeHead(204).end()
      }
   },

   {
      method: 'PATCH',
      path: buildRoutePath('/tasks/:id/complete'),
      handler: (req, res) => {
         const { id } = req.params
         const task = database.select('tasks', null, id)
         const data = {
            iscomplete: true
         }
         database.update('tasks', id, data)

         return res.end(JSON.stringify(task))
      }
   },
]