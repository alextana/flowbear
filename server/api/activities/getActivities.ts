import { db } from '~/db'
import { activities, goals, activitiesToGoals } from '~/db/schema'
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

  const data = goalId
    ? await baseQuery.where(eq(goals.goalId, goalId))
    : await baseQuery

  if (!data) {
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
