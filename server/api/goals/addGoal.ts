import { db } from '~/db'
import { activitiesToGoals, todosToGoals } from '~/db/schema'
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

  if (!body.activityId && !body.todoId) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'Cannot add goal to activity/todo without activity/todo id',
    })
  }

  if (!body.goalId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot add goal to activity/todo without goal id',
    })
  }

  // add goal to activity by adding it to the join table
  const goal = body.todoId
    ? await db.insert(todosToGoals).values({
        todoId: body.todoId,
        goalId: body.goalId,
      })
    : await db.insert(activitiesToGoals).values({
        activityId: body.activityId,
        goalId: body.goalId,
      })

  return {
    goal,
  }
})
