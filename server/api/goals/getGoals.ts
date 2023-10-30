import { db } from '~/db'
import { goals } from '~/db/schema'
import { desc, eq } from 'drizzle-orm'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = (await getServerSession(event)) as any

  if (!session?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorised',
    })
  }

  const data = await db
    .select()
    .from(goals)
    .orderBy(desc(goals.created_at))
    .limit(10)
    .where(eq(session.id, goals.userId))

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No goals were found',
    })
  }

  return data
})
