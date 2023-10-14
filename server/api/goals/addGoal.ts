import { db } from '~/db'
import { activitiesToGoals } from '~/db/schema'
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

  if (!body.activityId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot add goal to activity without activity id',
    })
  }

  if (!body.goalId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot add goal to activity without goal id',
    })
  }

  // add goal to activity by adding it to the join table
  await db.insert(activitiesToGoals).values({
    activityId: body.activityId,
    goalId: body.goalId,
  })

  // await db.insert(goals).values({
  //   title: body.title,
  //   userId: session.id,
  //   description: body.description,
  //   content: body.content,
  // })

  return {
    body,
  }
})
