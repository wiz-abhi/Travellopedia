import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Create a new Redis instance
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Create a new ratelimiter that allows 5 requests per day
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(7, "1 d"),
  analytics: true,
  prefix: "guest_ratelimit",
})