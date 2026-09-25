'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { COUNTRIES, getCountryByCode } from '@/lib/countries'

export function CountryCodeSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (code: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const selected = getCountryByCode(value)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    if (searchRef.current) searchRef.current.focus()
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COUNTRIES
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.dialCode.includes(q)
    )
  }, [query])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-1.5 cursor-pointer focus:outline-none py-2 pl-0.5"
      >
        {selected && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={selected.flag}
            alt={selected.code}
            className="w-6 h-4 rounded-sm object-cover border border-gray-200"
          />
        )}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country…"
              className="w-full h-9 px-3 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#4043FF]/20 placeholder:text-gray-400"
            />
          </div>
          <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-400">No countries found</li>
            )}
            {filtered.map((country) => {
              const active = country.code === value
              return (
                <li key={country.code} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(country.code)
                      setOpen(false)
                      setQuery('')
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                      active ? 'bg-[#F0F0FF]' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={country.flag}
                        alt={country.code}
                        className="w-6 h-4 rounded-sm object-cover border border-gray-200 shrink-0"
                      />
                      <span className={`truncate ${active ? 'font-semibold text-[#4043FF]' : 'text-gray-700'}`}>
                        {country.name}
                      </span>
                    </span>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">{country.dialCode}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}