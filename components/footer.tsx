import { Github, Twitter, Linkedin } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Travellopedia</h3>
            <p className="text-sm">
              Your AI-powered travel companion for creating unforgettable journeys.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="grid grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li>
                  <Link href="/explore" className="hover:text-white transition-colors">
                    Explore
                  </Link>
                </li>
                <li>
                  <Link href="/bookmarks" className="hover:text-white transition-colors">
                    Bookmarks
                  </Link>
                </li>
              </ul>
              <ul className="space-y-2">
                <li>
                  <Link href="/todos" className="hover:text-white transition-colors">
                    Todo List
                  </Link>
                </li>
                <li>
                  <Link href="/history" className="hover:text-white transition-colors">
                    Travel History
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Travellopedia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
