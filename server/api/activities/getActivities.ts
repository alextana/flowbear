import { db } from '~/db'
import { activities } from '~/db/schema'
import { desc } from 'drizzle-orm'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = (await getServerSession(event)) as any

  if (!session?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorised',
    })
  }

  // TODO add params to do more with this, filtering etc
  const data = await db
    .select()
    .from(activities)
    .orderBy(desc(activities.created_at))
    .limit(10)

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No activities were found',
    })
  }

  return data
})
