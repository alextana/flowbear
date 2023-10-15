import { db } from '~/db'
import { activitiesToGoals } from '~/db/schema'
import { getServerSession } from '#auth'
import { and, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const session = (await getServerSession(event)) as any

  if (!session?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorised',
    })
  }

  const body = await readBody(event)

  if (!body.activityId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot remove goal from activity without activity id',
    })
  }

  if (!body.goalId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot remove goal from activity without goal id',
    })
  }

  // remove goal to activity by adding it to the join table
  await db
    .delete(activitiesToGoals)
    .where(
      and(
        eq(activitiesToGoals.activityId, body.activityId),
        eq(activitiesToGoals.goalId, body.goalId)
      )
    )

  return {
    body,
  }
})
