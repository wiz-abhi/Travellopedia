// app/api/explore/route.ts
import { NextResponse } from 'next/server'
import { openAIClient } from '@/lib/azure-openai'
import { auth } from '@clerk/nextjs'
import { headers } from 'next/headers'
import { ratelimit } from '@/lib/upstash'

// Define our own type for rate limit response
type RateLimitInfo = {
  success: boolean
  limit: number
  remaining: number
  reset: number
  pending: Promise<unknown>
}

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const startTime = performance.now()
  const TIME_LIMIT = 11000
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIME_LIMIT)

  // Define rateLimitInfo at the top level of the function
  let rateLimitInfo: RateLimitInfo | null = null
  // Define isGuestMode at the top level to be accessible in catch block
  let isGuestMode = false

  try {
    // Check authentication and guest mode
    const { userId } = auth()
    const headersList = headers()
    const referer = headersList.get('referer') || ''
    isGuestMode = referer.includes('mode=guest')
    
    // Get IP for rate limiting
    const ip = headersList.get('x-forwarded-for') || 'anonymous'

    if (!userId && !isGuestMode) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Apply rate limiting for guest users
    if (isGuestMode) {
      rateLimitInfo = await ratelimit.limit(ip) as RateLimitInfo

      if (!rateLimitInfo.success) {
        return NextResponse.json({
          error: 'Rate limit exceeded',
          limit: rateLimitInfo.limit,
          reset: rateLimitInfo.reset,
          remaining: rateLimitInfo.remaining
        }, { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitInfo.limit.toString(),
            'X-RateLimit-Remaining': rateLimitInfo.remaining.toString(),
            'X-RateLimit-Reset': rateLimitInfo.reset.toString()
          }
        })
      }
    }

    const { query, experience, dateRange } = await req.json()

    if (!process.env.AZURE_OPENAI_DEPLOYMENT_NAME) {
      throw new Error('Missing Azure OpenAI Deployment Name')
    }

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

    const cleanResponse = response
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    // Create response with cleaned data
    const jsonResponse = NextResponse.json(JSON.parse(cleanResponse))

    // Add rate limit headers to successful response if in guest mode
    if (isGuestMode && rateLimitInfo) {
      jsonResponse.headers.set('X-RateLimit-Limit', rateLimitInfo.limit.toString())
      jsonResponse.headers.set('X-RateLimit-Remaining', rateLimitInfo.remaining.toString())
      jsonResponse.headers.set('X-RateLimit-Reset', rateLimitInfo.reset.toString())
    }

    return jsonResponse

  } catch (error) {
    console.error('Error:', error)

    // Create error response with appropriate status and message
    const errorResponse = (message: string, status: number) => {
      const response = NextResponse.json({ error: message }, { status })
      
      // Add rate limit headers to error responses if in guest mode
      if (isGuestMode && rateLimitInfo) {
        response.headers.set('X-RateLimit-Limit', rateLimitInfo.limit.toString())
        response.headers.set('X-RateLimit-Remaining', rateLimitInfo.remaining.toString())
        response.headers.set('X-RateLimit-Reset', rateLimitInfo.reset.toString())
      }
      
      return response
    }

    if (error instanceof Error) {
      if (error.message === 'Timeout' || error.message.includes('network')) {
        return errorResponse('Slow Internet Connection. Please try again later.', 504)
      }

      // Handle JSON parsing errors
      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        return errorResponse('Invalid response format. Please try again.', 500)
      }

      return errorResponse('Failed to process request. Please try again later.', 500)
    }

    return errorResponse('Unknown error occurred. Please try again later.', 500)
  }
}