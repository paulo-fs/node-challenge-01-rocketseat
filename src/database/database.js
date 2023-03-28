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

   select(table, search) {
      let data = this.#database[table] ?? []
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
         if(data.updated_at) foundItem.updated_at = data.updated_at
         this.#persist()
         return data
      }
   }

   delete(table, id) {
      const filteredList = this.#database[table].filter(row => row.id !== id)
      this.#database[table] = filteredList
      this.#persist()
   }
}