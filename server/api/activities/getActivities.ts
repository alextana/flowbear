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
    .orderBy(desc(activities.created_at))
    .leftJoin(goals, eq(activitiesToGoals.goalId, goals.goalId))
    .limit(20)

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No activities were found',
    })
  }

  const groupedDataMap = data.reduce((result, item) => {
    const { activity, activity_to_goal, goal } = item

    interface GroupedData {
      [key: string]: {
        activity: typeof activity
        activity_to_goal: typeof activity_to_goal
        goals: Array<typeof goal>
      }
    }

    const resultData: GroupedData = result
    const existingEntry = resultData[activity.id]

    if (existingEntry) {
      // If an entry exists, add the goal to the goals array
      existingEntry.goals.push(goal)
    } else {
      // If no entry exists, create a new entry with the activity and the goal in an array
      resultData[activity.id] = {
        activity,
        activity_to_goal,
        goals: [goal],
      }
    }

    return result
  }, {})

  // Convert the map values to an array
  const groupedData = Object.values(groupedDataMap)

  return groupedData
})
