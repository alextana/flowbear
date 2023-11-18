import { db } from '~/db'
import { todos, goals, todosToGoals } from '~/db/schema'
import { sql } from 'drizzle-orm'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = (await getServerSession(event)) as any
  const query = getQuery(event)

  if (!session?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorised',
    })
  }

  let start = new Date(),
    end = new Date()

  function singleDateQuery(query: any) {
    start = new Date(query)
    end = new Date(start)
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)
  }

  const setDateQuery = () => {
    if (!query.date) return ''

    if (query.date && typeof query.date === 'string') {
      singleDateQuery(query.date)
    }

    if (query.date && Array.isArray(query.date)) {
      if (query.date[1] === 'null') {
        singleDateQuery(query.date)
      } else {
        start = new Date(query.date[0])
        end = new Date(query.date[1])

        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)
      }
    }
  }

  setDateQuery()

  const finalSql = sql.empty()
  const finalCountSql = sql.empty()

  finalSql.append(sql`
    SELECT ${todos.id}, ${todos.title}, ${todos.description}, ${todos.completed}, ${todos.created_at}, ${todosToGoals.goalId} as goal_id
    FROM ${todos}
    LEFT JOIN ${todosToGoals} ON ${todos.id} = ${todosToGoals.todoId}
    LEFT JOIN ${goals} ON ${todosToGoals.goalId} = ${goals.goalId}
    WHERE ${session.id} = ${todos.userId}
  `)

  if (query.date) {
    finalSql.append(
      sql`
      AND ${todos.created_at} >= ${start.toISOString()} AND
      ${todos.created_at} <= ${end.toISOString()}`
    )
  }

  finalSql.append(sql`ORDER BY ${todos.created_at} DESC
    LIMIT ${query.limit || '20'}
    OFFSET ${query.offset || '0'}
  `)

  finalCountSql.append(sql`
    SELECT COUNT(${todos.id})
    FROM ${todos}
    WHERE ${session.id} = ${todos.userId}
  `)

  if (query.date) {
    finalCountSql.append(sql`
      AND ${todos.created_at} >= ${start.toISOString()} AND
      ${todos.created_at} <= ${end.toISOString()}
    `)
  }

  const data = await db.execute(finalSql)
  const total = await db.execute(finalCountSql)

  return {
    todos: data,
    total: total[0]?.count,
  }
})
