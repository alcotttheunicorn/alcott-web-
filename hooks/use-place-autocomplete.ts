'use client'

import { useEffect, useRef, useState } from 'react'

export interface PlacePrediction {
  placeId: string
  mainText: string
  secondaryText: string
  fullText: string
}

// Uses the Places API (New) Autocomplete endpoint directly via fetch, rather
// than loading the full Google Maps JavaScript SDK. This app's address
// inputs are heavily custom-styled (icons, borders, layout baked into each
// page) — the JS SDK's <Autocomplete> widget takes over the input's own
// dropdown rendering and is hard to restyle to match. Calling the REST API
// ourselves means the suggestion list is just data we render in our own
// markup, same as any other API response in this app.
//
// Session tokens group a sequence of keystrokes + the final place selection
// into one billing session (Google charges per session, not per keystroke) —
// generated fresh each time the input is cleared/a place is picked.
function newSessionToken() {
  return crypto.randomUUID()
}

export function usePlaceAutocomplete(query: string, options?: { country?: string }) {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([])
  const [loading, setLoading] = useState(false)
  const sessionTokenRef = useRef(newSessionToken())
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    const trimmed = query.trim()
    if (trimmed.length < 3) {
      setPredictions([])
      return
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
    if (!apiKey) {
      // Fails silently rather than throwing — an address input should still
      // work as a plain text field if the key isn't configured (e.g. local
      // dev without the env var set), it just won't show suggestions.
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
          },
          body: JSON.stringify({
            input: trimmed,
            sessionToken: sessionTokenRef.current,
            ...(options?.country ? { includedRegionCodes: [options.country] } : {}),
          }),
        })

        if (!res.ok) {
          console.error('Places autocomplete request failed:', await res.text())
          setPredictions([])
          return
        }

        const data = await res.json()
        const suggestions = Array.isArray(data.suggestions) ? data.suggestions : []
        setPredictions(
          suggestions
            .filter((s: any) => s.placePrediction)
            .map((s: any) => ({
              placeId: s.placePrediction.placeId,
              mainText: s.placePrediction.structuredFormat?.mainText?.text ?? s.placePrediction.text?.text ?? '',
              secondaryText: s.placePrediction.structuredFormat?.secondaryText?.text ?? '',
              fullText: s.placePrediction.text?.text ?? '',
            }))
        )
      } catch (err) {
        console.error('Places autocomplete failed:', err)
        setPredictions([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, options?.country])

  const resetSession = () => {
    sessionTokenRef.current = newSessionToken()
    setPredictions([])
  }

  return { predictions, loading, sessionToken: sessionTokenRef.current, resetSession }
}