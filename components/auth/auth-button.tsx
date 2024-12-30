'use client'

import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

export function AuthButton() {
  const { isSignedIn } = useUser()

  if (isSignedIn) {
    return <UserButton afterSignOutUrl="/" />
  }

  return (
    <div className="flex items-center gap-4">
      <SignInButton mode="modal">
        <Button variant="outline">Sign In</Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button>Sign Up</Button>
      </SignUpButton>
    </div>
  )
}