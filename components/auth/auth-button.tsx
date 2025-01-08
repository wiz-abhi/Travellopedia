'use client'

import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Define the type for the closeMenu prop
interface AuthButtonProps {
  closeMenu?: () => void
}

export function AuthButton({ closeMenu }: AuthButtonProps) {
  const { isSignedIn } = useUser()

  if (isSignedIn) {
    return (
      <>
        {/* Call closeMenu when the UserButton is rendered or after a user action */}
        {closeMenu && (
          <Link href="/" onClick={closeMenu}>
            <UserButton afterSignOutUrl="/" />
          </Link>
        )}
      </>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 gap-2">
      <Link href="/explore?mode=guest" onClick={closeMenu}>
        <Button variant="outline">Guest Mode</Button>
      </Link>
      <SignInButton mode="modal">
        <Button
          variant="outline"
          onClick={() => {
            if (closeMenu) closeMenu()
          }}
        >
          Sign In
        </Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button
          onClick={() => {
            if (closeMenu) closeMenu()
          }}
        >
          Sign Up
        </Button>
      </SignUpButton>
    </div>
  )
}
