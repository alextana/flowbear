import { db } from '~/db'
import { summaries } from '~/db/schema'
import { sql } from 'drizzle-orm'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = (await getServerSession(event)) as any
  const query = getQuery(event)

  if (!session?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorised',
    })
  }

  const data = await db.execute(sql`
    SELECT * FROM ${summaries}
    WHERE ${session.id} = ${summaries.userId}
  `)

  return data
})
