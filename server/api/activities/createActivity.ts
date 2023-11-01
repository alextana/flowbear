import { db } from '~/db'
import { activities, activitiesToGoals } from '~/db/schema'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = (await getServerSession(event)) as any

  if (!session?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorised',
    })
  }

  const body = await readBody(event)

  if (!body.content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot add empty activity',
    })
  }

  let activity = null

  try {
    activity = await db
      .insert(activities)
      .values({
        userId: session.id,
        content: body.content,
        type: body.type,
      })
      .returning()
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot add activity',
    })
  }

  if (body.goalId && activity[0].id) {
    await db.insert(activitiesToGoals).values({
      activityId: activity[0].id,
      goalId: body.goalId,
    })
  }

  return {
    activity,
  }
})
