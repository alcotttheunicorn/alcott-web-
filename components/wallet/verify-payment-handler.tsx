'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useVerifyFund } from '@/hooks/use-wallet'
import { SuccessModal } from '@/components/ui/success-modal'
import { toast } from '@/components/ui/use-toast'

const PENDING_REF_KEY = 'alcott_pending_topup_ref'
const ATTEMPTS_KEY_PREFIX = 'alcott_topup_verify_attempts'


const PENDING_TTL_MS = 10 * 60 * 1000



const MAX_ATTEMPTS = 15
const RETRY_DELAY_MS = 4000
const RETRY_BACKOFF = 1.15
const MAX_RETRY_DELAY_MS = 12000

function readPendingReference(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(PENDING_REF_KEY)
    if (!raw) return null
    // Expected format: { reference, ts }. A legacy plain string (from before
    // the TTL change) or a malformed/expired entry is treated as stale.
    let parsed: { reference?: string; ts?: number }
    try {
      parsed = JSON.parse(raw)
    } catch {
      clearPendingReference()
      return null
    }
    if (!parsed?.reference || typeof parsed.ts !== 'number') {
      clearPendingReference()
      return null
    }
    if (Date.now() - parsed.ts > PENDING_TTL_MS) {
      clearPendingReference()
      return null
    }
    return parsed.reference
  } catch {
    return null
  }
}

function clearPendingReference(reference?: string) {
  if (typeof window === 'undefined') return
  try {
    // Resolve the reference for attempts-key cleanup before dropping the ref.
    let ref = reference
    if (!ref) {
      const raw = window.sessionStorage.getItem(PENDING_REF_KEY)
      try {
        ref = raw ? JSON.parse(raw)?.reference ?? undefined : undefined
      } catch {
        ref = undefined
      }
    }
    window.sessionStorage.removeItem(PENDING_REF_KEY)
    if (ref) window.sessionStorage.removeItem(`${ATTEMPTS_KEY_PREFIX}_${ref}`)
  } catch {
    // ignore storage errors
  }
}

function loadAttemptCount(reference: string): number {
  try {
    return Number(window.sessionStorage.getItem(`${ATTEMPTS_KEY_PREFIX}_${reference}`)) || 0
  } catch {
    return 0
  }
}

function saveAttemptCount(reference: string, count: number) {
  try {
    window.sessionStorage.setItem(`${ATTEMPTS_KEY_PREFIX}_${reference}`, String(count))
  } catch {
    // ignore storage errors
  }
}

export function VerifyPaymentHandler() {
  const { token } = useAuth()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const verifyFundMutation = useVerifyFund()
  const [showSuccess, setShowSuccess] = useState(false)
  // Steady overlay state: true from the first attempt until success/final
  // give-up. Tying the overlay to the mutation's isPending made it flash on
  // and off between retries (visible gap in every 4-8s retry window).
  const [confirming, setConfirming] = useState(false)
  const handledRef = useRef<string | null>(null)

  useEffect(() => {
    // URL params are only present on the very first landing after Paystack;
    // sessionStorage survives a manual refresh, so verification keeps firing
    // until the webhook lands even if the user reloads.
    const fromUrl = searchParams.get('reference') ?? searchParams.get('trxref')
    const reference = fromUrl ?? readPendingReference()
    if (!reference || !token) return
   
    if (handledRef.current === reference) return

    handledRef.current = reference


    let attempt = loadAttemptCount(reference)
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined

    const giveUp = () => {
      clearPendingReference(reference)
      setConfirming(false)
      toast({
        title: 'Still confirming payment…',
        description: 'Your wallet will be credited as soon as the payment provider confirms it. Refresh this page later to check.',
      })
      if (fromUrl) router.replace(pathname)
    }

    if (attempt >= MAX_ATTEMPTS) {
      giveUp()
      return
    }

    setConfirming(true)

    const attemptVerify = () => {
      if (cancelled) return
      verifyFundMutation.mutate(reference, {
        onSuccess: () => {
          if (cancelled) return
          clearPendingReference(reference)
          setConfirming(false)
          setShowSuccess(true)
          if (fromUrl) router.replace(pathname)
        },
        onError: () => {
          if (cancelled) return
          attempt += 1
          saveAttemptCount(reference, attempt)
          if (attempt < MAX_ATTEMPTS) {
            const delay = Math.min(
              RETRY_DELAY_MS * Math.pow(RETRY_BACKOFF, attempt),
              MAX_RETRY_DELAY_MS,
            )
            timer = setTimeout(attemptVerify, delay)
          } else {
            giveUp()
          }
        },
      })
    }

    attemptVerify()
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <>
      {confirming && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-white/80">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-[#4043FF] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700 ">
              Confirming your payment…
            </p>
          </div>
        </div>
      )}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Top Up Successful!"
        message="The balance will be added to your wallet"
        buttonText="OK"
      />
    </>
  )
}
