'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface ExperienceInputProps {
  value: string
  onChange: (value: string) => void
}

export function ExperienceInput({ value, onChange }: ExperienceInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="experience">What would you like to experience?</Label>
      <Textarea
        id="experience"
        placeholder="E.g., I want to experience local culture, try authentic cuisine, and visit historical sites..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-24"
      />
    </div>
  )
}