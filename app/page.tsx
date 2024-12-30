import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Hero Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"
          alt="Travel Hero"
          fill
          className="object-cover brightness-50"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center text-white">
        <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl mb-6">
          Your Journey Begins Here
        </h1>
        <p className="mx-auto max-w-[700px] text-xl md:text-2xl text-gray-200 mb-8">
          Discover your perfect adventure with AI-powered travel recommendations,
          personalized itineraries, and real-time weather insights.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[700px] sm:max-w-none justify-center">
          <Link href="/explore">
            <Button size="lg" className="text-lg w-full sm:w-auto">
              Start Planning
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/bookmarks">
            <Button size="lg" variant="outline" className="text-lg w-full sm:w-auto">
              Bookmarked Trips
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
