'use client'

import { Button } from '@/components/ui/button'

interface SuggestionsProps {
  onSelect: (place: string) => void
}

const SUGGESTED_PLACES = ['Delhi', 'Manali', 'Jaipur', 'Udaipur', 'Goa']

export function Suggestions({ onSelect }: SuggestionsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <span className="text-sm text-muted-foreground mr-2">Popular destinations:</span>
      {SUGGESTED_PLACES.map((place) => (
        <Button
          key={place}
          variant="outline"
          size="sm"
          onClick={() => onSelect(place)}
          className="rounded-full"
        >
          {place}
        </Button>
      ))}
    </div>
  )
}