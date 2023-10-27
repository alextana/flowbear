import { db } from '~/db'
import { todos } from '~/db/schema'
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

  if (!body.title) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot update todo without a title',
    })
  }

  await db
    .update(todos)
    .set({
      title: body.title,
      completed: body.completed,
      description: body.description,
    })
    .where(eq(todos.id, body.id))

  return {
    body,
  }
})
