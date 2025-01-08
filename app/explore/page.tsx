'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { LucideIcon, MapPin, Calendar, Plane, Hotel, Cloud, DollarSign, Lightbulb, Bookmark } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useUser } from '@clerk/nextjs'
import { SearchForm } from './components/search-form'
import { DateRangePicker } from './components/date-range-picker'
import { ExperienceInput } from './components/experience-input'
import { Suggestions } from './components/suggestions'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SignUpButton } from '@clerk/nextjs'

// ResultCard Types and Component
type ContentItem = {
  name?: string
  price_range?: string
  description?: string
  [key: string]: any
}

type Content = string | string[] | ContentItem[]

interface ResultCardProps {
  icon: LucideIcon
  title: string
  content: Content
  className?: string
}

const ResultCard = ({
  icon: Icon,
  title,
  content,
  className = '',
}: ResultCardProps) => {
  const renderContentItem = (item: string | ContentItem, index: number) => {
    if (typeof item === 'string') {
      return <li key={index}>{item}</li>
    }

    if (typeof item === 'object' && item !== null) {
      const displayText = item.name || item.value || JSON.stringify(item)
      const details = item.price_range || item.description || ''
      return (
        <li key={index}>
          <span className="font-medium">{displayText}</span>
          {details && <span className="text-gray-600"> - {details}</span>}
        </li>
      )
    }

    return null
  }

  const renderContent = () => {
    if (Array.isArray(content)) {
      return content.map((item, index) => renderContentItem(item, index))
    }
    return <p className="mt-2">{content}</p>
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      {Array.isArray(content) ? (
        <ul className="list-disc list-inside space-y-2">
          {renderContent()}
        </ul>
      ) : (
        renderContent()
      )}
    </Card>
  )
}

// ExplorePage Types
type TravelInfo = {
  attractions: any[]
  best_time: string
  transportation: any[]
  accommodation: any[]
  weather: string
  estimated_budget: string
  personalized_suggestions: any[]
}

// Main ExplorePage Component
export default function ExplorePage() {
  const [results, setResults] = useState<TravelInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [experience, setExperience] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(),
    to: new Date(),
  })
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { isSignedIn } = useUser()
  const searchParams = useSearchParams()
  const isGuestMode = searchParams.get('mode') === 'guest'

 // Additional state to control rate limit message
const [rateLimitReached, setRateLimitReached] = useState(false);

const handleSearch = async (data: { query: string }) => {
  setSearchQuery(data.query);

  // If the user is not signed in and not in guest mode, restrict access
  if (!isSignedIn && !isGuestMode) {
    toast({
      title: 'Authentication required',
      description: 'Please sign in or use guest mode to continue',
      variant: 'destructive',
    });
    return;
  }

  // Reset states
  setLoading(true);
  setError(null);
  setRateLimitReached(false);

  try {
    const response = await fetch('/api/explore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: data.query,
        experience,
        dateRange,
      }),
    });

    if (response.status === 429) {
      const data = await response.json();
      if (!isSignedIn) {
        setRateLimitReached(true);
        toast({
          title: 'Rate limit exceeded',
          description: `Guest mode limit reached. Please sign up to continue. Resets in ${Math.ceil(
            (data.reset - Date.now()) / 1000 / 60
          )} minutes.`,
          variant: 'destructive',
        });
      }
      return;
    }

    if (!response.ok) {
      throw new Error('Failed to fetch travel information');
    }

    const result = await response.json();
    setResults(result);

    // Notify guest users of remaining queries
    if (isGuestMode) {
      const remaining = response.headers.get('X-RateLimit-Remaining');
      toast({
        title: 'Guest Mode',
        description: `${remaining} queries remaining`,
      });
    }
  } catch (error) {
    console.error(error);
    setError('Failed to fetch travel information. Please try again.');
    toast({
      title: 'Error',
      description: 'Failed to fetch travel information. Please try again.',
      variant: 'destructive',
    });
  } finally {
    setLoading(false);
  }
};

const handleBookmark = async () => {
  if (!results || !searchQuery) return

  try {
    const response = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destination: searchQuery,
        details: results,
        imageUrl:
          'https://images.unsplash.com/photo-1488085061387-422e29b40080',
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to save bookmark')
    }

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
        {!rateLimitReached ? (
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
        ) : (
          <Card className="p-6 mb-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Guest Query Limit Reached</h2>
          <p className="mb-6">Sign up to continue exploring and get unlimited access!</p>
          <SignUpButton mode="modal">
            <Button size="lg">Sign Up Now</Button>
          </SignUpButton>
        </Card>
        )}

        {error && (
          <div className="bg-red-500 text-white p-4 rounded mb-8">
            <strong>{error}</strong>
          </div>
        )}

        {loading && !rateLimitReached && (
          <div className="flex justify-center mb-8">
            <div className="animate-spin border-t-4 border-blue-500 border-solid rounded-full h-12 w-12"></div>
          </div>
        )}

        {results && !loading && (
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
                content={results?.attractions || []}
              />
              <ResultCard
                icon={Calendar}
                title="Best Time to Visit"
                content={results?.best_time || ''}
              />
              <ResultCard
                icon={Plane}
                title="Getting Around"
                content={results?.transportation || []}
              />
              <ResultCard
                icon={Hotel}
                title="Where to Stay"
                content={results?.accommodation || []}
              />
              <ResultCard
                icon={Cloud}
                title="Weather"
                content={results?.weather || ''}
              />
              <ResultCard
                icon={DollarSign}
                title="Budget Estimate"
                content={results?.estimated_budget || ''}
              />
              <ResultCard
                icon={Lightbulb}
                title="Personalized Suggestions"
                content={results?.personalized_suggestions || []}
                className="md:col-span-2"
              />
            </div>
          </>
        )}
      </div>
    </div>
  </div>
);
}