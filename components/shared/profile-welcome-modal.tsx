'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ProfileWelcomeModalProps {
  open: boolean
  /** Called when the user accepts and should be taken to /profile-setup */
  onComplete: () => void
}

export function ProfileWelcomeModal({ open, onComplete }: ProfileWelcomeModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        // Non-dismissible: no escape, no outside click.
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="max-w-md rounded-3xl p-8 text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#4043FF]/10">
          <svg className="h-8 w-8 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>

        <DialogHeader className="mt-4 items-center">
          <DialogTitle className="text-xl font-bold text-gray-900">
            Welcome to Alcott! 👋
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-relaxed text-gray-600">
            Let&apos;s complete your profile before you continue — we just need
            your name, phone number, and address so you can book and
            track shipments.
          </DialogDescription>
        </DialogHeader>

        <Button
          onClick={onComplete}
          className="mt-6 h-12 w-full rounded-full bg-[#4043FF] font-bold text-white hover:bg-[#3333CC]"
        >
          Complete my profile
        </Button>
      </DialogContent>
    </Dialog>
  )
}
