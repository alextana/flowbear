import { db } from '~/db'
import { todos, goals, todosToGoals } from '~/db/schema'
import { desc, eq, sql, gte } from 'drizzle-orm'
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

  const goalId = query.goalId as number

  const data = goalId
    ? await baseQuery.where(eq(goals.goalId, goalId))
    : await baseQuery

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No todos were found',
    })
  }

  type GroupedType = Record<
    string,
    {
      todos: (typeof data)[0]['todos']
      todo_to_goal: (typeof data)[0]['todo_to_goal']
      goals: Array<(typeof data)[0]['goal']>
    }
  >

  // Maintain the order of todos
  const todoOrder: number[] = []
  const groupedDataMap: GroupedType = data.reduce(
    (result: GroupedType, item) => {
      const { todos, todo_to_goal, goal } = item

      if (!todoOrder.includes(todos.id)) {
        todoOrder.push(todos.id)
      }

      const existingEntry = result[todos.id]

      if (existingEntry) {
        existingEntry.goals.push(goal)
      } else {
        result[todos.id] = {
          todos,
          todo_to_goal,
          goals: [goal],
        }
      }

      return result
    },
    {}
  )

  const groupedData = todoOrder.map((todoId) => groupedDataMap[todoId])

  return groupedData
})
