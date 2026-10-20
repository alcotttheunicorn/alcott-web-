'use client'

import { useState } from 'react'
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import {
  useCreateSurcharge,
  useDeleteSurcharge,
  useSurcharges,
  useUpdateSurcharge,
} from '@/hooks/use-pricing'
import { useShipmentCategories } from '@/hooks/use-shipments'

export function SurchargeManager() {
  const { data: surcharges = [], isLoading, isError } = useSurcharges()
  const { data: categories = [] } = useShipmentCategories()

  const createSurcharge = useCreateSurcharge()
  const updateSurcharge = useUpdateSurcharge()
  const deleteSurcharge = useDeleteSurcharge()

  const labelFor = (value: string) =>
    categories.find((c) => c.value === value)?.label ?? value

  // --- add form ---
  const [addCategory, setAddCategory] = useState('')
  const [addCost, setAddCost] = useState('')
  const surchargedValues = new Set(surcharges.map((s) => s.category))
  const availableCategories = categories.filter((c) => !surchargedValues.has(c.value))
  const busy =
    createSurcharge.isPending || updateSurcharge.isPending || deleteSurcharge.isPending

  const errMessage = (err: unknown, fallback: string) => {
    const e = err as { response?: { data?: { message?: string } }; message?: string }
    return e?.response?.data?.message || e?.message || fallback
  }

  const handleAdd = () => {
    const cost = Number(addCost)
    if (!addCategory) {
      toast({ title: 'Pick a category', description: 'Choose which category to surcharge.' })
      return
    }
    if (!Number.isFinite(cost) || cost < 0) {
      toast({ title: 'Invalid cost', description: 'Enter a non-negative amount per kg.' })
      return
    }
    createSurcharge.mutate(
      { category: addCategory, cost_per_kg: cost },
      {
        onSuccess: () => {
          toast({ title: 'Surcharge added', description: `${labelFor(addCategory)} → ₦${cost.toLocaleString()}/kg.` })
          setAddCategory('')
          setAddCost('')
        },
        onError: (err) => toast({ title: 'Could not add surcharge', description: errMessage(err, 'Please try again.') }),
      },
    )
  }

  // --- inline edit ---
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCost, setEditCost] = useState('')

  const startEdit = (id: string, current: number) => {
    setEditingId(id)
    setEditCost(String(current))
  }

  const saveEdit = (id: string, category: string) => {
    const cost = Number(editCost)
    if (!Number.isFinite(cost) || cost < 0) {
      toast({ title: 'Invalid cost', description: 'Enter a non-negative amount per kg.' })
      return
    }
    updateSurcharge.mutate(
      { id, cost_per_kg: cost },
      {
        onSuccess: () => {
          toast({ title: 'Surcharge updated', description: `${labelFor(category)} → ₦${cost.toLocaleString()}/kg.` })
          setEditingId(null)
        },
        onError: (err) => toast({ title: 'Could not update', description: errMessage(err, 'Please try again.') }),
      },
    )
  }

  const handleDelete = (id: string, category: string) => {
    if (!window.confirm(`Remove the surcharge for ${labelFor(category)}?`)) return
    deleteSurcharge.mutate(id, {
      onSuccess: () => toast({ title: 'Surcharge removed', description: `${labelFor(category)} no longer carries a surcharge.` }),
      onError: (err) => toast({ title: 'Could not remove', description: errMessage(err, 'Please try again.') }),
    })
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Category Surcharges</h2>
        <p className="mt-1 text-xs text-gray-500">
          Optional per-kg fee (NGN) added to shipping quotes for a category. One surcharge per category.
        </p>
      </div>

      {/* Add row */}
      <div className="flex flex-col sm:flex-row gap-2 mb-5">
        <select
          value={addCategory}
          onChange={(e) => setAddCategory(e.target.value)}
          disabled={busy}
          className="flex-1 h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4043FF]"
        >
          <option value="">Select category…</option>
          {availableCategories.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <input
          type="text"
          inputMode="decimal"
          value={addCost}
          onChange={(e) => setAddCost(e.target.value.replace(/[^0-9.]/g, ''))}
          placeholder="Cost per kg (₦)"
          disabled={busy}
          className="h-10 w-full sm:w-40 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4043FF]"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={busy || !addCategory || addCost === ''}
          className="inline-flex h-10 items-center justify-center gap-1 rounded-md bg-[#4043FF] px-4 text-sm font-semibold text-white transition hover:bg-[#3333CC] disabled:opacity-50"
        >
          {createSurcharge.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add
        </button>
      </div>

      {/* List */}
      {isError ? (
        <p className="text-sm text-destructive">Could not load surcharges.</p>
      ) : isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : surcharges.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-400">No surcharges configured.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {surcharges.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{labelFor(s.category)}</p>
                <p className="text-xs text-gray-500">{s.category}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {editingId === s.id ? (
                  <>
                    <input
                      type="text"
                      inputMode="decimal"
                      autoFocus
                      value={editCost}
                      onChange={(e) => setEditCost(e.target.value.replace(/[^0-9.]/g, ''))}
                      className="h-9 w-28 rounded-md border border-gray-300 px-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#4043FF]"
                    />
                    <button
                      type="button"
                      onClick={() => saveEdit(s.id, s.category)}
                      disabled={updateSurcharge.isPending}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#4043FF] text-white disabled:opacity-50"
                      aria-label="Save"
                    >
                      {updateSurcharge.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : '✓'}
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
                    <span className="text-sm font-bold text-gray-900">₦{s.cost_per_kg.toLocaleString()}/kg</span>
                    <button
                      type="button"
                      onClick={() => startEdit(s.id, s.cost_per_kg)}
                      disabled={busy}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id, s.category)}
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
