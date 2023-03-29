import fs from 'node:fs/promises'

const databasePath = new URL('db.json', import.meta.url)

export class Database {
   #database = {}

   constructor() {
      fs.readFile(databasePath, 'utf8')
         .then(data => this.#database = JSON.parse(data))
         .catch(() => {
            this.#persist()
         })
   }

   #persist() {
      fs.writeFile(databasePath, JSON.stringify(this.#database))
   }

   select(table, search, id) {
      let data = this.#database[table] ?? []

      if (search) {
         console.log(search)
         data = data.filter(row => {
            return Object.entries(search).some(([key, value]) => {
               return row[key].toLowerCase().includes(value.toLowerCase())
            })
         })
         return data
      }

      if (id) {
         const itemIndex = this.#database[table].findIndex(row => row.id === id)

         if (itemIndex === -1) {
            return 404
         }

         return this.#database[table][itemIndex]
      }

      return data
   }

   insert(table, data) {
      if (!data) return
      if (Array.isArray(this.#database[table])) {
         this.#database[table].push(data)
      } else {
         this.#database[table] = [data]
      }
      this.#persist()
      return data
   }

   update(table, id, data) {
      if (!data) return
      const itemIndex = this.#database[table].findIndex(row => row.id === id)
      if (itemIndex > -1) {
         const foundItem = this.#database[table][itemIndex]
         if(data.title) foundItem.title = data.title
         if(data.description) foundItem.description = data.description
         if(data.iscomplete) foundItem.iscomplete = !foundItem.iscomplete
         if(data.iscomplete) foundItem.iscomplete ? foundItem.completed_at = new Date() : foundItem.completed_at = null
         foundItem.updated_at = new Date()
         this.#persist()
         return data
      } else {
         return 404
      }
   }

   delete(table, id) {
      const itemIndex = this.#database[table].findIndex(row => row.id === id)
      if (itemIndex === -1) {
         return 404
      }

      const filteredList = this.#database[table].filter(row => row.id !== id)
      this.#database[table] = filteredList
      this.#persist()
   }
}