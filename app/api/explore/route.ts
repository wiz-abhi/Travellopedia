import { NextResponse } from 'next/server'
import { openAIClient } from '@/lib/azure-openai'
import { auth } from '@clerk/nextjs'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const startTime = performance.now(); // Log start time
  const TIME_LIMIT = 9800; // 10 seconds timeout in milliseconds
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIME_LIMIT);

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

    // Fetch the OpenAI response with timeout handling
    const completion = await openAIClient.getChatCompletions(
      process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      [
        {
          role: "system",
          content: `You are a travel expert. Provide detailed information about travel destinations in JSON format with the following keys:
            - attractions: Array of top attractions and activities, each on a new line, less than 6
            - best_time: Best times to visit based on weather and events
            - transportation: Array of transportation options,max 3
            - accommodation: Array of accommodation suggestions with price ranges in INR
            - weather: Local weather conditions and seasonal patterns,in brief
            - estimated_budget: Estimated daily budget in INR for a typical tourist
            - personalized_suggestions: Array of suggestions based on user's experience preferences,max 3

            Format numbers with commas for better readability (e.g., 1,500 INR).
            Keep each section concise but informative.`
        },
        {
          role: "user",
          content: `Destination: ${query}\nDesired Experience: ${experience}\nTravel Dates: ${dateRange.from} to ${dateRange.to}`
        }
      ],
      {
        signal: controller.signal, // Associate the timeout with the request
        responseFormat: { type: "json_object" }
      }
    )

    clearTimeout(timeoutId); // Clear the timeout when the response is received

    const result = completion.choices[0].message?.content
    if (!result) {
      throw new Error('No response from Azure OpenAI')
    }

    const endTime = performance.now(); // Log end time
    console.log(`Time taken: ${(endTime - startTime).toFixed(2)}ms`); // Log time taken

    return NextResponse.json(JSON.parse(result))
  } catch (error) {
    console.error('Error:', error)

    // If the error is related to timeout or network issues, send a specific message
    if (error.message.includes('timeout') || error.message.includes('network')) {
      return NextResponse.json(
        { error: 'Slow Internet Connection. Please try again later.' },
        { status: 504 } // Gateway Timeout
      )
    }

    // For general errors, send a fallback error message
    return NextResponse.json(
      { error: 'Failed to process request. Please try again later.' },
      { status: 500 }
    )
  }
}
