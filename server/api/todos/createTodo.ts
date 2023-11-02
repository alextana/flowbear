import { db } from '~/db'
import { todos, todosToGoals } from '~/db/schema'
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

  if (!body.title) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot add empty todo',
    })
  }

  let todo = null

  try {
    todo = await db
      .insert(todos)
      .values({
        userId: session.id,
        title: body.title,
        description: body.description,
        created_at: body.createdAt,
      })
      .returning()
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot add todo',
    })
  }

  if (body.goalId && todo[0].id) {
    await db.insert(todosToGoals).values({
      todoId: todo[0].id,
      goalId: body.goalId,
    })
  }

  return {
    todo,
  }
})
