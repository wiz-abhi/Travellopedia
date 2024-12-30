// 'use client'

// import { useEffect, useState } from 'react'
// import Image from 'next/image'
// import { Card } from '@/components/ui/card'
// import { useToast } from '@/hooks/use-toast'
// import { DetailDialog } from '../explore/components/detail-dialog'

// interface Bookmark {
//   _id: string
//   destination: string
//   details: {
//     attractions: string[]
//     transportation: string[]
//     accommodation: string[]
//     weather: string
//     budget: string
//     suggestions: string[]
//   }
//   imageUrl: string
// }

// export default function BookmarksPage() {
//   const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
//   const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null)
//   const { toast } = useToast()

//   useEffect(() => {
//     const fetchBookmarks = async () => {
//       try {
//         const response = await fetch('/api/bookmarks')
//         if (!response.ok) throw new Error('Failed to fetch bookmarks')
//         const data = await response.json()
//         setBookmarks(data)
//       } catch (error) {
//         toast({
//           title: 'Error',
//           description: 'Failed to load bookmarks',
//           variant: 'destructive',
//         })
//       }
//     }

//     fetchBookmarks()
//   }, [toast])

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="relative h-[200px] mb-8">
//         <Image
//           src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
//           alt="Bookmarked Places"
//           fill
//           className="object-cover brightness-75"
//         />
//         <div className="absolute inset-0 flex items-center justify-center bg-black/30">
//           <h1 className="text-4xl font-bold text-white">Bookmarked Places</h1>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-8">
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {bookmarks.map((bookmark) => (
//             <Card 
//               key={bookmark._id}
//               className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
//               onClick={() => setSelectedBookmark(bookmark)}
//             >
//               <div className="relative h-48">
//                 <Image
//                   src={bookmark.imageUrl}
//                   alt={bookmark.destination}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <div className="p-4">
//                 <h3 className="text-xl font-semibold mb-2">{bookmark.destination}</h3>
//                 <p className="text-muted-foreground line-clamp-2">
//                   {bookmark.details.attractions.slice(0, 1).join(', ')}...
//                 </p>
//               </div>
//             </Card>
//           ))}
//         </div>
//       </div>

//       {selectedBookmark && (
//         <DetailDialog
//           open={!!selectedBookmark}
//           onOpenChange={() => setSelectedBookmark(null)}
//           title={selectedBookmark.destination}
//           content={[
//             ...selectedBookmark.details.attractions,
//             ...selectedBookmark.details.transportation,
//             ...selectedBookmark.details.accommodation,
//             selectedBookmark.details.weather,
//             selectedBookmark.details.budget,
//             ...selectedBookmark.details.suggestions,
//           ]}
//         />
//       )}
//     </div>
//   )
// }



'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'  // Import Link from next/link
import { DetailDialog } from '../explore/components/detail-dialog'

interface Bookmark {
  _id: string
  destination: string
  details: {
    attractions: string[]
    transportation: string[]
    accommodation: string[]
    weather: string
    budget: string
    suggestions: string[]
  }
  imageUrl: string
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch('/api/bookmarks')
        if (!response.ok) throw new Error('Failed to fetch bookmarks')
        const data = await response.json()
        setBookmarks(data)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load bookmarks',
          variant: 'destructive',
        })
      }
    }

    fetchBookmarks()
  }, [toast])

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[200px] mb-8">
        <Image
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
          alt="Bookmarked Places"
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <h1 className="text-4xl font-bold text-white">Bookmarked Places</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark) => (
            <Link 
              key={bookmark._id} 
              href={`/explore?bookmarkId=${bookmark._id}`}  // Use Link with bookmarkId as query param
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative h-48">
                  <Image
                    src={bookmark.imageUrl}
                    alt={bookmark.destination}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{bookmark.destination}</h3>
                  <p className="text-muted-foreground line-clamp-2">
                    {bookmark.details.attractions.slice(0, 1).join(', ')}...
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {selectedBookmark && (
        <DetailDialog
          open={!!selectedBookmark}
          onOpenChange={() => setSelectedBookmark(null)}
          title={selectedBookmark.destination}
          content={[...selectedBookmark.details.attractions, ...selectedBookmark.details.transportation, ...selectedBookmark.details.accommodation, selectedBookmark.details.weather, selectedBookmark.details.budget, ...selectedBookmark.details.suggestions]}
        />
      )}
    </div>
  )
}
