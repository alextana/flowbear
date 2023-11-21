import { db } from '~/db'
import { tasks, goals, tasksToGoals } from '~/db/schema'
import { desc, eq, sql, gte, and, lte } from 'drizzle-orm'
import { getServerSession } from '#auth'

// groups tasks by goals, useful for the task widget
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
      .from(tasks)
      .where(gte(tasks.created_at, today.toISOString()))

    return data
  }

  const baseQuery = db
    .select()
    .from(tasks)
    .leftJoin(tasksToGoals, eq(tasks.id, tasksToGoals.taskId))
    .leftJoin(goals, eq(tasksToGoals.goalId, goals.goalId))
    .orderBy(desc(tasks.created_at))

  function singleDateQuery(query: any) {
    const q = query.replaceAll('"', '')
    const d = new Date(q)
    d.setHours(0, 0, 0, 0)

    const endOfDay = new Date(d)
    endOfDay.setHours(23, 59, 59, 999)

    // Add filter for a specific date
    baseQuery.where(
      and(
        eq(session.id, tasks.userId),
        gte(tasks.created_at, d.toISOString() as string),
        lte(tasks.created_at, endOfDay.toISOString() as string)
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
          eq(session.id, tasks.userId),
          gte(tasks.created_at, start.toISOString() as string),
          lte(tasks.created_at, end.toISOString() as string)
        )
      )
    }
  }

  const data = await baseQuery

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No tasks were found',
    })
  }

  const groupedData: {
    [key: string]: {
      goal: any
      tasks: any[]
    }
  } = {}

  data.forEach((item) => {
    const goal = item.goal

    if (goal) {
      if (!groupedData[goal.title]) {
        groupedData[goal.title] = {
          goal: goal,
          tasks: [],
        }
      }

      groupedData[goal.title].tasks.push(item.tasks)
    } else {
      // If there's no goal, group the task as "No Goal"
      if (!groupedData['No goal']) {
        groupedData['No goal'] = {
          goal: { title: 'No goal' },
          tasks: [],
        }
      }

      groupedData['No goal'].tasks.push(item.tasks)
    }
  })

  // Convert the grouped data object into an array
  const result = Object.values(groupedData)

  return result
})
