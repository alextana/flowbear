import { db } from '~/db'
import { activitiesToGoals, goals, todos, todosToGoals } from '~/db/schema'
import { desc, eq, sql, and, inArray } from 'drizzle-orm'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = (await getServerSession(event)) as any

  if (!session?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorised',
    })
  }

  const data = await db.execute(sql`
  SELECT ${goals.title}, ${goals.description}, ${goals.content}, ${goals.goalId},
    COUNT(${todosToGoals.todoId}) AS total_todos,
    SUM(CASE WHEN ${todos.completed} THEN 1 ELSE 0 END) AS completed_todos,
    (SELECT COUNT(*) FROM ${activitiesToGoals} WHERE ${activitiesToGoals.goalId} = ${goals.goalId}) AS total_activities
  FROM ${goals}

    LEFT JOIN ${todosToGoals} ON ${goals.goalId} = ${todosToGoals.goalId}
    LEFT JOIN ${todos} ON ${todosToGoals.todoId} = ${todos.id}
    WHERE ${session.id} = ${goals.userId}

    GROUP BY ${goals.title}, ${goals.description}, ${goals.content}, ${goals.goalId}
  `)

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No goals were found',
    })
  }

  return data
})
