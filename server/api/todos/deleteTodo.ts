import { db } from '~/db'
import { todos, todosToGoals } from '~/db/schema'
import { getServerSession } from '#auth'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const session = (await getServerSession(event)) as any

  if (!session?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorised',
    })
  }

  const body = await readBody(event)

  if (!body.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot remove todo without id',
    })
  }

  // delete the activities to goals before
  // deleting the activity
  try {
    await db.delete(todosToGoals).where(eq(todosToGoals.todoId, body.id))
  } catch (error) {
    // fail silently
  }

  await db.delete(todos).where(eq(todos.id, body.id))

  return {
    body,
  }
})
