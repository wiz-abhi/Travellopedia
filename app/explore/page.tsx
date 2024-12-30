'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  MapPin,
  Calendar,
  Plane,
  Hotel,
  Cloud,
  DollarSign,
  Lightbulb,
  Bookmark,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useUser } from '@clerk/nextjs'
import { SearchForm } from './components/search-form'
import { ResultCard } from './components/result-card'
import { DateRangePicker } from './components/date-range-picker'
import { ExperienceInput } from './components/experience-input'
import { Suggestions } from './components/suggestions'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// ... (keep existing TravelInfo type)

export default function ExplorePage() {
  const [results, setResults] = useState<null>(null)
  const [loading, setLoading] = useState(false)
  const [experience, setExperience] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(),
    to: new Date(),
  })
  const { toast } = useToast()
  const { isSignedIn } = useUser()

  const handleSearch = async (data: { query: string }) => {
    setSearchQuery(data.query)
    if (!isSignedIn) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to use this feature',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/explore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          experience,
          dateRange,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch travel information')
      }

      const result = await response.json()
      setResults(result)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch travel information. Please try again.',
        variant: 'destructive',
      })
    }
    setLoading(false)
  }

  const handleBookmark = async () => {
    if (!results || !searchQuery) return

    try {
      await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: searchQuery,
          details: results,
          imageUrl:
            'https://images.unsplash.com/photo-1488085061387-422e29b40080',
        }),
      })

      toast({
        title: 'Success',
        description: 'Place bookmarked successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to bookmark place',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[300px] mb-8">
        <Image
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080"
          alt="Explore Hero"
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            Plan Your Perfect Adventure
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 mb-8">
            <div className="grid gap-6">
              <Suggestions
                onSelect={(place) => handleSearch({ query: place })}
              />
              <SearchForm onSubmit={handleSearch} loading={loading} />
              <ExperienceInput value={experience} onChange={setExperience} />
              <DateRangePicker onDateChange={setDateRange} />
            </div>
          </Card>

          {results && (
            <>
              <div className="flex justify-end mb-4">
                <Button onClick={handleBookmark} variant="outline">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Bookmark this place
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <ResultCard
                  icon={MapPin}
                  title="Must-Visit Places"
                  content={results.attractions}
                />
                <ResultCard
                  icon={Calendar}
                  title="Best Time to Visit"
                  content={results.best_time}
                />
                <ResultCard
                  icon={Plane}
                  title="Getting Around"
                  content={results.transportation}
                />
                <ResultCard
                  icon={Hotel}
                  title="Where to Stay"
                  content={results.accommodation}
                />
                <ResultCard
                  icon={Cloud}
                  title="Weather"
                  content={results.weather}
                />
                <ResultCard
                  icon={DollarSign}
                  title="Budget Estimate"
                  content={results.estimated_budget}
                />
                <ResultCard
                  icon={Lightbulb}
                  title="Personalized Suggestions"
                  content={results.personalized_suggestions}
                  className="md:col-span-2"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
