'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useVerifyFund } from '@/hooks/use-wallet'
import { SuccessModal } from '@/components/ui/success-modal'
import { toast } from '@/components/ui/use-toast'

const PENDING_REF_KEY = 'alcott_pending_topup_ref'

// Longer window: the Paystack webhook that credits the wallet can arrive a
// minute or more after the checkout page finishes, so verify keeps retrying
// instead of giving up on the first `pending`/`fail` response.
const MAX_ATTEMPTS = 30
const RETRY_DELAY_MS = 4000
const RETRY_BACKOFF = 1.1

function readPendingReference(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.sessionStorage.getItem(PENDING_REF_KEY)
  } catch {
    return null
  }
}

function clearPendingReference() {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.removeItem(PENDING_REF_KEY)
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
  const handledRef = useRef<string | null>(null)

  useEffect(() => {
    // URL params are only present on the very first landing after Paystack;
    // sessionStorage survives a manual refresh, so verification keeps firing
    // until the webhook lands even if the user reloads.
    const fromUrl = searchParams.get('reference') ?? searchParams.get('trxref')
    const reference = fromUrl ?? readPendingReference()
    if (!reference || !token) return
    // This effect intentionally depends only on `token`: run once when the
    // token is available. UserAppLayout stays mounted across page changes, so
    // reading pathname/searchParams here (at start) and only depending on
    // `token` keeps the poll timer alive while the user navigates around.
    if (handledRef.current === reference) return

    handledRef.current = reference

    let attempt = 0
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined

    const attemptVerify = () => {
      if (cancelled) return
      verifyFundMutation.mutate(reference, {
        onSuccess: () => {
          if (cancelled) return
          clearPendingReference()
          setShowSuccess(true)
          if (fromUrl) router.replace(pathname)
        },
        onError: () => {
          if (cancelled) return
          attempt += 1
          if (attempt < MAX_ATTEMPTS) {
            const delay = RETRY_DELAY_MS * Math.pow(RETRY_BACKOFF, attempt)
            timer = setTimeout(attemptVerify, delay)
          } else {
            // Give up for now, but KEEP the stored reference so the next
            // app load (or a later refresh) tries again automatically.
            toast({
              title: 'Still confirming payment…',
              description: 'Your wallet will be credited as soon as the payment is confirmed.',
            })
            if (fromUrl) router.replace(pathname)
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

  const isPending = verifyFundMutation.isPending && handledRef.current !== null

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/80">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-[#4043FF] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
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