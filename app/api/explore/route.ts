import { NextResponse } from 'next/server'
import { openAIClient } from '@/lib/azure-openai'
import { auth } from '@clerk/nextjs'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const startTime = performance.now()
  const TIME_LIMIT = 9800
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIME_LIMIT)

  try {
    // Check for both auth and guest mode
    const { userId } = auth()
    const headersList = headers()
    const referer = headersList.get('referer') || ''
    const isGuestMode = referer.includes('mode=guest')

    if (!userId && !isGuestMode) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { query, experience, dateRange } = await req.json()

    if (!process.env.AZURE_OPENAI_DEPLOYMENT_NAME) {
      throw new Error('Missing Azure OpenAI Deployment Name')
    }

    // Define the OpenAI request
    const openAIRequest = openAIClient.getChatCompletions(
      process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      [
        {
          role: 'system',
          content: `You are a travel expert. Provide detailed information about travel destinations in JSON format with the following keys:
            - attractions: Array of top attractions and activities, each on a new line, less than 6
            - best_time: Best times to visit based on weather and events
            - transportation: Array of transportation options,max 3
            - accommodation: Array of accommodation suggestions with price ranges in INR
            - weather: Local weather conditions and seasonal patterns,in brief
            - estimated_budget: Estimated daily budget in INR for a typical tourist
            - personalized_suggestions: Array of suggestions based on user's experience preferences,max 3

            Format numbers with commas for better readability (e.g., 1,500 INR).
            Keep each section concise but informative.`,
        },
        {
          role: 'user',
          content: `Destination: ${query}\nDesired Experience: ${experience}\nTravel Dates: ${dateRange.from} to ${dateRange.to}`,
        },
      ]
    )

    // Use Promise.race to implement a timeout
    const result = await Promise.race([
      openAIRequest,
      new Promise<Error>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), TIME_LIMIT)
      ),
    ])

    clearTimeout(timeoutId)

    const endTime = performance.now()
    console.log(`Time taken: ${(endTime - startTime).toFixed(2)}ms`)

    if (result instanceof Error) {
      throw result
    }

    const response = result.choices[0].message?.content
    if (!response) {
      throw new Error('No response from Azure OpenAI')
    }

    // Clean the response to remove markdown formatting
    const cleanResponse = response
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    // Parse the cleaned response
    return NextResponse.json(JSON.parse(cleanResponse))
  } catch (error) {
    console.error('Error:', error)

    if (error instanceof Error) {
      if (error.message === 'Timeout' || error.message.includes('network')) {
        return NextResponse.json(
          { error: 'Slow Internet Connection. Please try again later.' },
          { status: 504 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to process request. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Unknown error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}
