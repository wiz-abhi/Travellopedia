'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plane, Menu} from 'lucide-react'
import { AuthButton } from '@/components/auth/auth-button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const navLinks = [
    { href: '/explore', label: 'Explore' },
    { href: '/bookmarks', label: 'Bookmarks' },
    { href: '/todos', label: 'Todo List' },
    { href: '/history', label: 'History' },
  ]

  // Function to close the hamburger menu
  const closeMenu = () => setIsOpen(false)

  // Function to handle closing both the hamburger and modal
  const handleClose = () => {
    closeMenu()
    setIsModalOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <Plane className="h-6 w-6" />
              <span className="ml-2 text-xl font-bold">Travellopedia</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center">
            <ThemeToggle />
            <div className="hidden sm:block">
              <AuthButton closeMenu={closeMenu} /> {/* Pass closeMenu to AuthButton */}
            </div>
            
            {/* Mobile Menu */}
            <div className="sm:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`ml-2 ${isModalOpen ? 'pointer-events-none opacity-50' : ''}`}
                  >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={handleClose} // Close both modal and menu when link is clicked
                        className="text-lg font-medium hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <div className="pt-4 mt-4 border-t">
                      <AuthButton closeMenu={handleClose} /> {/* Close menu when AuthButton is clicked */}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
