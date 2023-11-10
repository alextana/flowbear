/*
  Summaries endpoint
  takes a date, or array of dates
  and gets all the activities/todos in between
  probably do some manipulation to
  make it AI digestible

  send it to the openAI API
  get the result back
  figure out if the result is including weird info
  we don't need and strip it
*/
import { getServerSession } from '#auth'
import { db } from '~/db'
import { sql } from 'drizzle-orm'
import { activities, todos, summaries } from '~/db/schema'
import { OpenAI } from 'openai'
const runtimeConfig = useRuntimeConfig()
const { OPEN_AI_KEY } = runtimeConfig

const openai = new OpenAI({
  apiKey: OPEN_AI_KEY,
})

export default defineEventHandler(async (event) => {
  const session = (await getServerSession(event)) as any

  if (!session?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorised',
    })
  }

  const query = getQuery(event)

  console.log(query)

  if (!query.date) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'Cannot fetch entries without dates, please select dates and try again',
    })
  }

  let startDate,
    endDate = null

  function singleDateQuery(query: any) {
    startDate = new Date(query)
    startDate.setHours(0, 0, 0, 0)

    endDate = new Date(startDate)
    endDate.setHours(23, 59, 59, 999)
  }

  if (query.date && typeof query.date === 'string') {
    singleDateQuery(query.date[0])
  }

  if (query.date && Array.isArray(query.date)) {
    if (query.date[1] === 'null') {
      singleDateQuery(query.date)
    } else {
      startDate = new Date(query.date[0])
      endDate = new Date(query.date[1])

      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
    }
  }

  startDate = startDate?.toISOString()
  endDate = endDate?.toISOString()

  // get activities and (completed) todos between two dates
  const data = await db.execute(sql`
    SELECT ${activities.content} as title,
    CASE WHEN ${
      activities.type
    } = 'activity' THEN 'activity' ELSE 'feedback' END as type
      FROM ${activities}
      WHERE ${session.id} = ${activities.userId}
      AND (${activities.created_at} >= ${startDate} AND ${
        activities.created_at
      } <= ${endDate})
    UNION
      SELECT ${todos.title}, ${'todo'}
      FROM ${todos}
      WHERE ${session.id} = ${todos.userId}
      AND (${todos.created_at} >= ${startDate} AND ${
        todos.created_at
      } <= ${endDate})
      AND ${todos.completed} = TRUE
  `)

  if (!data.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot create a summary without any data.',
    })
  }

  let generatedSummary = null

  if (query?.use_ai) {
    try {
      generatedSummary = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `
          This is a list of activities/feedback and todos, the type is specified in the object,
          please make a summary of these to make them human readable,
          feel free to rewrite things to improve brevity and readability.
          these should be used in a 121 with a manager, do NOT add a title to the result.
          List them as Activities, Feedback, Completed Todos and Discussion points.
          If relevant add other considerations.
          Please output Markdown and create discussion points.
          Do not include any extra text, only respond with the lists.

          ------
          ${JSON.stringify(data)}
          ------
        `,
          },
        ],
      })
    } catch (error: any) {
      throw createError({
        statusCode: (error?.status as number) || 500,
        statusMessage:
          'There was an issue with the OpenAI API, please try again later.',
      })
    }
  }

  // Add this to summary
  try {
    await db.insert(summaries).values({
      title: (query?.title as string) || 'Summary',
      description: (query?.description as string) || '',
      content: query.use_ai ? generatedSummary?.choices[0].message.content : '',
      userId: session.id,
    })
  } catch (error) {}

  return generatedSummary
})
