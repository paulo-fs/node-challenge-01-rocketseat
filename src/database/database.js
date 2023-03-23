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

   select(table, search) {}

   insert(table, data) {}

   update(table, id) {}

   delete(table, id) {}
}