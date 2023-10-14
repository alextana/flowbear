import { db } from '~/db'
import { activities, goals, activitiesToGoals } from '~/db/schema'
import { desc, eq } from 'drizzle-orm'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = (await getServerSession(event)) as any

  if (!session?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorised',
    })
  }

  // ONLY GETS MATCHING
  // const data = await db
  //   .select()
  //   .from(activitiesToGoals)
  //   .leftJoin(activities, eq(activitiesToGoals.activityId, activities.id))
  //   .leftJoin(goals, eq(activitiesToGoals.goalId, goals.goalId))
  //   .limit(20)

  // GETS ALL
  const data = await db
    .select()
    .from(activities)
    .leftJoin(
      activitiesToGoals,
      eq(activities.id, activitiesToGoals.activityId)
    )
    .leftJoin(goals, eq(activitiesToGoals.goalId, goals.goalId))
    .orderBy(desc(activities.created_at))

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
