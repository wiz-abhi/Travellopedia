'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

const searchSchema = z.object({
  query: z.string().min(1, 'Please enter a destination or description'),
})

export type SearchSchema = z.infer<typeof searchSchema>

interface SearchFormProps {
  onSubmit: (data: SearchSchema) => Promise<void>
  loading: boolean
}

export function SearchForm({ onSubmit, loading }: SearchFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<SearchSchema>({
    resolver: zodResolver(searchSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
      <div className="flex gap-4">
        <Input
          {...register('query')}
          placeholder="Enter a destination or describe your ideal trip..."
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            'Search'
          )}
        </Button>
      </div>
      {errors.query && (
        <p className="text-red-500 mt-2">{errors.query.message}</p>
      )}
    </form>
  )
}