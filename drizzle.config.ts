// import type { Config } from 'drizzle-kit'
// import * as dotenv from 'dotenv'

// dotenv.config({
//   path: '.env',
// })

// export default {
//   schema: ['./db/schema/index.ts'],
//   out: './drizzle',
//   driver: 'pg',
//   dbCredentials: {
//     connectionString: process.env.DATABASE_URL,
//   },
// } satisfies Config

import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './db/schema/index.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
})
