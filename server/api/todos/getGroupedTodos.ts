import { db } from '~/db'
import { todos, goals, todosToGoals } from '~/db/schema'
import { desc, eq, sql, gte, and, lte } from 'drizzle-orm'
import { getServerSession } from '#auth'

// groups todos by goals, useful for the todo widget
export default defineEventHandler(async (event) => {
  const session = (await getServerSession(event)) as any
  const query = getQuery(event)

  if (!session?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorised',
    })
  }

  if (query.count) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const data = await db
      .select({ count: sql<number>`count(*)` })
      .from(todos)
      .where(gte(todos.created_at, today.toISOString()))

    return data
  }

  const baseQuery = db
    .select()
    .from(todos)
    .leftJoin(todosToGoals, eq(todos.id, todosToGoals.todoId))
    .leftJoin(goals, eq(todosToGoals.goalId, goals.goalId))
    .orderBy(desc(todos.created_at))

  function singleDateQuery(query: any) {
    const q = query.replaceAll('"', '')
    const d = new Date(q)
    d.setHours(0, 0, 0, 0)

    const endOfDay = new Date(d)
    endOfDay.setHours(23, 59, 59, 999)

    // Add filter for a specific date
    baseQuery.where(
      and(
        eq(session.id, todos.userId),
        gte(todos.created_at, d.toISOString() as string),
        lte(todos.created_at, endOfDay.toISOString() as string)
      )
    )
  }

  if (query.date && typeof query.date === 'string') {
    singleDateQuery(query.date)
  }

  if (query.date && Array.isArray(query.date)) {
    if (query.date[1] === 'null') {
      singleDateQuery(query.date[0])
    } else {
      const start = new Date(query.date[0])
      const end = new Date(query.date[1])

      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)

      baseQuery.where(
        and(
          eq(session.id, todos.userId),
          gte(todos.created_at, start.toISOString() as string),
          lte(todos.created_at, end.toISOString() as string)
        )
      )
    }
  }

  const data = await baseQuery

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No todos were found',
    })
  }

  const groupedData: {
    [key: string]: {
      goal: any
      todos: any[]
    }
  } = {}

  data.forEach((item) => {
    const goal = item.goal

    if (goal) {
      if (!groupedData[goal.title]) {
        groupedData[goal.title] = {
          goal: goal,
          todos: [],
        }
      }

      groupedData[goal.title].todos.push(item.todos)
    } else {
      // If there's no goal, group the todo as "No Goal" or any other label you prefer
      if (!groupedData['No goal']) {
        groupedData['No goal'] = {
          goal: { title: 'No goal' },
          todos: [],
        }
      }

      groupedData['No goal'].todos.push(item.todos)
    }
  })

  // Convert the grouped data object into an array
  const result = Object.values(groupedData)

  return result
})
