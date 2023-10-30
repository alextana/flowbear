import { db } from '~/db'
import { activities, goals, activitiesToGoals } from '~/db/schema'
import { desc, eq, sql, gte, lte, and } from 'drizzle-orm'
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
      .from(activities)
      .where(gte(activities.created_at, today.toISOString()))

    return data
  }

  const baseQuery = db
    .select()
    .from(activities)
    .leftJoin(
      activitiesToGoals,
      eq(activities.id, activitiesToGoals.activityId)
    )
    .leftJoin(goals, eq(activitiesToGoals.goalId, goals.goalId))
    .orderBy(desc(activities.created_at))

  const goalId = query.goalId as number

  let d, endOfDay

  if (query.date && typeof query.date === 'string') {
    d = new Date(query.date)
    d.setHours(0, 0, 0, 0)
    endOfDay = new Date(d)
    endOfDay.setHours(23, 59, 59, 999)
    // Add filter for a specific date
  }

  baseQuery.where(
    and(
      eq(session.id, goals.userId),
      query.date
        ? gte(activities.created_at, d?.toISOString() as string)
        : undefined,
      query.date
        ? lte(activities.created_at, endOfDay?.toISOString() as string)
        : undefined,
      query.goalId ? eq(goals.goalId, goalId) : undefined
    )
  )

  const data = await baseQuery

  if (!data || !data.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No activities were found',
    })
  }

  type GroupedType = Record<
    string,
    {
      activity: (typeof data)[0]['activity']
      activity_to_goal: (typeof data)[0]['activity_to_goal']
      goals: Array<(typeof data)[0]['goal']>
    }
  >

  // Maintain the order of activities
  const activityOrder: number[] = []
  const groupedDataMap: GroupedType = data.reduce(
    (result: GroupedType, item) => {
      const { activity, activity_to_goal, goal } = item

      if (!activityOrder.includes(activity.id)) {
        activityOrder.push(activity.id)
      }

      const existingEntry = result[activity.id]

      if (existingEntry) {
        existingEntry.goals.push(goal)
      } else {
        result[activity.id] = {
          activity,
          activity_to_goal,
          goals: [goal],
        }
      }

      return result
    },
    {}
  )
  const groupedData = activityOrder.map(
    (activityId) => groupedDataMap[activityId]
  )

  return groupedData
})
