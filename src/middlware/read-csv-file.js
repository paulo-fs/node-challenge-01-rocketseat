import { parse } from 'csv-parse'

export async function csvParser(req, res) {
   const buffers = []

   const parser = req.pipe(parse({
      delimiter: ',',
      columns: true,
      trim: true,
      skip_empty_lines: true
   }))
      
   for await (const record of parser) {
      buffers.push(record)
   }

   try {
      req.body = buffers
   } catch {
      req.body = null
   }

   res.setHeader('Content-type', 'application/json')
}