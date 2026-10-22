'use client'

import { useMemo, useState } from 'react'
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import {
  useCreateZoneSurcharge,
  useDeleteZoneSurcharge,
  useUpdateZoneSurcharge,
  useZoneSurcharges,
  useZonePricing,
} from '@/hooks/use-pricing'
import type { ZoneSurchargeRow } from '@/lib/api/types'


export function ZoneSurchargeManager() {
  const { data: rows = [], isLoading, isError } = useZoneSurcharges()
  const { data: zones } = useZonePricing()

  const createZoneSurcharge = useCreateZoneSurcharge()
  const updateZoneSurcharge = useUpdateZoneSurcharge()
  const deleteZoneSurcharge = useDeleteZoneSurcharge()

  const zoneCodes = useMemo(() => {
    const list = (zones ?? []) as { zone_code?: number }[]
    const codes = list
      .map((z) => (typeof z.zone_code === 'number' ? z.zone_code : undefined))
      .filter((c): c is number => typeof c === 'number')
      .sort((a, b) => a - b)
    return codes.length > 0 ? codes : [1, 2, 3, 4, 5]
  }, [zones])

  const busy =
    createZoneSurcharge.isPending || updateZoneSurcharge.isPending || deleteZoneSurcharge.isPending

  // --- add form ---
  const [fromZone, setFromZone] = useState('')
  const [toZone, setToZone] = useState('')
  const [cost, setCost] = useState('')

  // --- inline edit ---
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCost, setEditCost] = useState('')

  const errMessage = (err: unknown, fallback: string) => {
    const e = err as { response?: { data?: { message?: string } }; message?: string }
    return e?.response?.data?.message || e?.message || fallback
  }

  const handleAdd = () => {
    const from = Number(fromZone)
    const to = Number(toZone)
    const perKg = Number(cost)
    if (!fromZone || !toZone) {
      toast({ title: 'Pick zones', description: 'Choose both an origin and a destination zone.' })
      return
    }
    if (from === to) {
      toast({ title: 'Zones must differ', description: 'Same-zone moves are never surcharged.' })
      return
    }
    if (!Number.isFinite(perKg) || perKg < 0) {
      toast({ title: 'Invalid cost', description: 'Enter a non-negative amount per kg.' })
      return
    }
    createZoneSurcharge.mutate(
      { from_zone: from, to_zone: to, cost_per_kg: perKg },
      {
        onSuccess: () => {
          toast({ title: 'Zone surcharge added', description: `Zone ${from} → ${to} → ₦${perKg.toLocaleString()}/kg.` })
          setFromZone('')
          setToZone('')
          setCost('')
        },
        onError: (err) => toast({ title: 'Could not add', description: errMessage(err, 'Please try again.') }),
      },
    )
  }

  const startEdit = (row: ZoneSurchargeRow) => {
    setEditingId(row.id)
    setEditCost(String(row.cost_per_kg))
  }

  const saveEdit = (row: ZoneSurchargeRow) => {
    const perKg = Number(editCost)
    if (!Number.isFinite(perKg) || perKg < 0) {
      toast({ title: 'Invalid cost', description: 'Enter a non-negative amount per kg.' })
      return
    }
    updateZoneSurcharge.mutate(
      { id: row.id, cost_per_kg: perKg },
      {
        onSuccess: () => {
          toast({ title: 'Zone surcharge updated', description: `Zone ${row.from_zone} → ${row.to_zone} → ₦${perKg.toLocaleString()}/kg.` })
          setEditingId(null)
        },
        onError: (err) => toast({ title: 'Could not update', description: errMessage(err, 'Please try again.') }),
      },
    )
  }

  const handleDelete = (row: ZoneSurchargeRow) => {
    if (!window.confirm(`Remove the surcharge for Zone ${row.from_zone} → ${row.to_zone}?`)) return
    deleteZoneSurcharge.mutate(row.id, {
      onSuccess: () => toast({ title: 'Zone surcharge removed', description: `Zone ${row.from_zone} → ${row.to_zone} no longer carries a fee.` }),
      onError: (err) => toast({ title: 'Could not remove', description: errMessage(err, 'Please try again.') }),
    })
  }

  const zoneSelectClass =
    'h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm transition-colors focus:border-[#4043FF] focus:outline-none focus:ring-2 focus:ring-[#4043FF]/30 disabled:bg-gray-50'

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Zone Surcharges</h2>
        <p className="mt-1 text-xs text-gray-500">
          Directional per-kg fee (NGN) for items crossing from one zone to another. Same-zone moves are never surcharged.
        </p>
      </div>

      {/* Add row */}
      <div className="mb-5 flex flex-col sm:flex-row gap-2">
        <select value={fromZone} onChange={(e) => setFromZone(e.target.value)} disabled={busy} className={`${zoneSelectClass} flex-1`}>
          <option value="">From zone…</option>
          {zoneCodes.map((z) => (
            <option key={`from-${z}`} value={z}>Zone {z}</option>
          ))}
        </select>
        <span className="hidden sm:inline-flex items-center text-gray-400">→</span>
        <select value={toZone} onChange={(e) => setToZone(e.target.value)} disabled={busy} className={`${zoneSelectClass} flex-1`}>
          <option value="">To zone…</option>
          {zoneCodes.map((z) => (
            <option key={`to-${z}`} value={z}>Zone {z}</option>
          ))}
        </select>
        <input
          type="text"
          inputMode="decimal"
          value={cost}
          onChange={(e) => setCost(e.target.value.replace(/[^0-9.]/g, ''))}
          placeholder="Cost per kg (₦)"
          disabled={busy}
          className={`${zoneSelectClass} w-full sm:w-40`}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={busy || !fromZone || !toZone || cost === ''}
          className="inline-flex h-10 items-center justify-center gap-1 rounded-md bg-[#4043FF] px-4 text-sm font-semibold text-white transition hover:bg-[#3333CC] disabled:opacity-50"
        >
          {createZoneSurcharge.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add
        </button>
      </div>

      {/* List */}
      {isError ? (
        <p className="text-sm text-destructive">Could not load zone surcharges.</p>
      ) : isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : rows.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-400">No zone surcharges configured.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {rows.map((row) => (
            <div key={row.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  Zone {row.from_zone} → Zone {row.to_zone}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {editingId === row.id ? (
                  <>
                    <input
                      type="text"
                      inputMode="decimal"
                      autoFocus
                      value={editCost}
                      onChange={(e) => setEditCost(e.target.value.replace(/[^0-9.]/g, ''))}
                      className="h-9 w-28 rounded-md border border-gray-300 px-2 text-sm text-right focus:border-[#4043FF] focus:outline-none focus:ring-2 focus:ring-[#4043FF]/30"
                    />
                    <button
                      type="button"
                      onClick={() => saveEdit(row)}
                      disabled={updateZoneSurcharge.isPending}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#4043FF] text-white disabled:opacity-50"
                      aria-label="Save"
                    >
                      {updateZoneSurcharge.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : '✓'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50"
                      aria-label="Cancel"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-bold text-gray-900">₦{row.cost_per_kg.toLocaleString()}/kg</span>
                    <button
                      type="button"
                      onClick={() => startEdit(row)}
                      disabled={busy}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(row)}
                      disabled={busy}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-destructive hover:bg-destructive/10 disabled:opacity-50"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
