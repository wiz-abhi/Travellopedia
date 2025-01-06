import { NextResponse } from 'next/server'
import { openAIClient } from '@/lib/azure-openai'
import { auth } from '@clerk/nextjs'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const startTime = performance.now(); // Log start time
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { query, experience, dateRange } = await req.json()

    if (!process.env.AZURE_OPENAI_DEPLOYMENT_NAME) {
      throw new Error('Missing Azure OpenAI Deployment Name')
    }

    const completion = await openAIClient.getChatCompletions(
      process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      [
        {
          role: "system",
          content: `You are a travel expert. Provide detailed information about travel destinations in JSON format with the following keys:
            - attractions: Array of top attractions and activities, each on a new line
            - best_time: Best times to visit based on weather and events
            - transportation: Array of transportation options
            - accommodation: Array of accommodation suggestions with price ranges in INR
            - weather: Local weather conditions and seasonal patterns
            - estimated_budget: Estimated daily budget in INR for a typical tourist
            - personalized_suggestions: Array of suggestions based on user's experience preferences
            
            Format numbers with commas for better readability (e.g., 1,500 INR).
            Keep each section concise but informative.`
        },
        {
          role: "user",
          content: `Destination: ${query}\nDesired Experience: ${experience}\nTravel Dates: ${dateRange.from} to ${dateRange.to}`
        }
      ],
      { responseFormat: { type: "json_object" } }
    )

    const result = completion.choices[0].message?.content
    if (!result) {
      throw new Error('No response from Azure OpenAI')
    }

    const endTime = performance.now(); // Log end time
    console.log(`Time taken: ${(endTime - startTime).toFixed(2)}ms`); // Log time taken

    return NextResponse.json(JSON.parse(result))
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
