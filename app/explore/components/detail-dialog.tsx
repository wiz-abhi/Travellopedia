'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

interface DetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  content: string[]
}

export function DetailDialog({ open, onOpenChange, title, content }: DetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 p-4">
            {content.map((item, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <p className="text-foreground/90">{item}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}