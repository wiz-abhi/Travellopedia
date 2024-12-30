'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { DetailDialog } from './detail-dialog'

interface ResultCardProps {
  icon: LucideIcon
  title: string
  content: string | string[]
  className?: string
}

export function ResultCard({ icon: Icon, title, content, className }: ResultCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Card 
        className={`p-6 hover:shadow-lg transition-shadow cursor-pointer ${className}`}
        onClick={() => Array.isArray(content) && setDialogOpen(true)}
      >
        <div className="flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2 text-lg text-foreground">{title}</h3>
            {Array.isArray(content) ? (
              <ul className="space-y-2 text-muted-foreground">
                {content.slice(0, 3).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
                {content.length > 3 && (
                  <li className="text-primary">+ {content.length - 3} more...</li>
                )}
              </ul>
            ) : (
              <p className="text-muted-foreground">{content}</p>
            )}
          </div>
        </div>
      </Card>

      {Array.isArray(content) && (
        <DetailDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title={title}
          content={content}
        />
      )}
    </>
  )
}