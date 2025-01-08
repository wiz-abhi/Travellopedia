import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"
          alt="Travel Hero"
          fill
          className="object-cover brightness-50"
          priority
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center text-white">
        <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl mb-6">
          Your Journey Begins Here
        </h1>
        <p className="mx-auto max-w-[700px] text-xl md:text-2xl text-gray-200 mb-8">
          Discover your perfect adventure with AI-powered travel recommendations,
          personalized itineraries, and real-time weather insights.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/explore">
            <Button size="lg" className="text-lg">
              Start Planning
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
  <Link href="/explore?mode=guest">
    <Button
      size="lg"
      variant="outline"
      className="text-lg text-gray-900 border-gray-900 hover:bg-gray-100 dark:text-white dark:border-white dark:hover:bg-gray-800"
    >
      Try as Guest
    </Button>
  </Link>
  <Link href="/bookmarks">
    <Button
      size="lg"
      variant="outline"
      className="text-lg text-gray-900 border-gray-900 hover:bg-gray-100 dark:text-white dark:border-white dark:hover:bg-gray-800"
    >
      Bookmarked Trips
    </Button>
  </Link>
</div>

      </div>
    </div>
  )
}