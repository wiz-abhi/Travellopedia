'use client'

import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function AuthButton() {
  const { isSignedIn } = useUser()

  if (isSignedIn) {
    return <UserButton afterSignOutUrl="/" />
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/explore?mode=guest">
        <Button variant="ghost">Guest Mode</Button>
      </Link>
      <SignInButton mode="modal">
        <Button variant="outline">Sign In</Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button>Sign Up</Button>
      </SignUpButton>
    </div>
  )
}