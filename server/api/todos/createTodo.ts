import { db } from '~/db'
import { goals, todos, todosToGoals } from '~/db/schema'
import { getServerSession } from '#auth'
import { sql } from 'drizzle-orm'

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
  let todoToGoal = null
  let todoGoals = null

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
    todoToGoal = await db
      .insert(todosToGoals)
      .values({
        todoId: todo[0].id,
        goalId: body.goalId,
      })
      .returning()

    todoGoals = await db.execute(sql`
      SELECT * FROM ${goals}
      WHERE ${session.id} = ${goals.userId} AND
      ${goals.goalId} = ${body.goalId}
      `)
  }

  return {
    todos: todo,
    todo_to_goals: todoToGoal,
    goals: todoGoals,
  }
})
