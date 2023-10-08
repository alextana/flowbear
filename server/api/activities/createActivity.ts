import { db } from '~/db'
import { activities } from '~/db/schema'
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

  await db.insert(activities).values({
    userId: session.id,
    content: body.content,
  })

  console.log('ee', event)

  return {
    body,
  }
})
