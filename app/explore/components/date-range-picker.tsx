'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DateRangePickerProps {
  onDateChange: (dates: { from: Date; to: Date }) => void
}

export function DateRangePicker({ onDateChange }: DateRangePickerProps) {
  const [date, setDate] = useState<{
    from: Date
    to: Date
  }>({
    from: new Date(),
    to: new Date(),
  })

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'MMM dd, yyyy')} -{' '}
                  {format(date.to, 'MMM dd, yyyy')}
                </>
              ) : (
                format(date.from, 'MMM dd, yyyy')
              )
            ) : (
              <span>Pick your travel dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(selectedDate: any) => {
              setDate(selectedDate)
              if (selectedDate?.from && selectedDate?.to) {
                onDateChange(selectedDate)
              }
            }}
            numberOfMonths={2}
            className="rounded-md border shadow-md p-3"
            classNames={{
              head_cell: 'text-muted-foreground font-semibold',
              day: cn(
                'h-9 w-9 text-center text-sm rounded-md transition-colors',
                'hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground'
              ),
              day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
              day_today: 'bg-accent text-accent-foreground',
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}