'use client'

import { useState } from 'react'
import { Archive, ArchiveRestore, Check, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import {
  useAdminCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/hooks/use-pricing'
import type { AdminCategory } from '@/lib/api/shipment-api'

export function CategoryManager() {
  const { data: categories = [], isLoading, isError } = useAdminCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const busy =
    createCategory.isPending || updateCategory.isPending || deleteCategory.isPending

  // --- add form ---
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  // --- inline edit ---
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const errMessage = (err: unknown, fallback: string) => {
    const e = err as { response?: { data?: { message?: string } }; message?: string }
    return e?.response?.data?.message || e?.message || fallback
  }

  const handleAdd = () => {
    const trimmed = name.trim()
    if (!trimmed) {
      toast({ title: 'Name required', description: 'Enter a category name.' })
      return
    }
    createCategory.mutate(
      { name: trimmed, ...(description.trim() ? { description: description.trim() } : {}) },
      {
        onSuccess: () => {
          toast({ title: 'Category created', description: `${trimmed} is now available for booking.` })
          setName('')
          setDescription('')
        },
        onError: (err) => toast({ title: 'Could not create category', description: errMessage(err, 'Please try again.') }),
      },
    )
  }

  const startEdit = (cat: AdminCategory) => {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditDescription(cat.description ?? '')
  }

  const saveEdit = (id: string) => {
    const trimmed = editName.trim()
    if (!trimmed) {
      toast({ title: 'Name required', description: 'Category name cannot be empty.' })
      return
    }
    updateCategory.mutate(
      { id, name: trimmed, description: editDescription.trim() },
      {
        onSuccess: () => {
          toast({ title: 'Category updated', description: `${trimmed} saved.` })
          setEditingId(null)
        },
        onError: (err) => toast({ title: 'Could not update', description: errMessage(err, 'Please try again.') }),
      },
    )
  }

  const toggleActive = (cat: AdminCategory) => {
    updateCategory.mutate(
      { id: cat.id, is_active: !cat.is_active },
      {
        onSuccess: () =>
          toast({
            title: cat.is_active ? 'Category deactivated' : 'Category activated',
            description: cat.is_active
              ? `${cat.name} is hidden from new bookings and the public picker.`
              : `${cat.name} is available for booking again.`,
          }),
        onError: (err) => toast({ title: 'Could not update', description: errMessage(err, 'Please try again.') }),
      },
    )
  }

  const handleDelete = (cat: AdminCategory) => {
    const used = cat._count?.shipments ?? 0
    const warning =
      used > 0
        ? `${cat.name} is used by ${used} shipment(s). It will be archived (hidden from new bookings) rather than deleted. Continue?`
        : `Permanently delete ${cat.name}? This cannot be undone.`
    if (!window.confirm(warning)) return
    deleteCategory.mutate(cat.id, {
      // The backend tells us which path it took; show its message directly.
      onSuccess: (res) =>
        toast({
          title: res?.data?.deleted ? 'Category deleted' : 'Category archived',
          description: res?.message || 'Done.',
        }),
      onError: (err) => toast({ title: 'Could not delete', description: errMessage(err, 'Please try again.') }),
    })
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Package Categories</h2>
        <p className="mt-1 text-xs text-gray-500">
          Categories are database-driven. Codes are generated automatically from the name and cannot be changed.
        </p>
      </div>

      {/* Add row */}
      <div className="mb-5 grid grid-cols-1 sm:grid-cols-[1fr_1.4fr_auto] gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          disabled={busy}
          className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm transition-colors focus:border-[#4043FF] focus:outline-none focus:ring-2 focus:ring-[#4043FF]/30 disabled:bg-gray-50"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          disabled={busy}
          className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm transition-colors focus:border-[#4043FF] focus:outline-none focus:ring-2 focus:ring-[#4043FF]/30 disabled:bg-gray-50"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={busy || !name.trim()}
          className="inline-flex h-10 items-center justify-center gap-1 rounded-md bg-[#4043FF] px-4 text-sm font-semibold text-white transition hover:bg-[#3333CC] disabled:opacity-50"
        >
          {createCategory.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add
        </button>
      </div>

      {/* List */}
      {isError ? (
        <p className="text-sm text-destructive">Could not load categories.</p>
      ) : isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : categories.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-400">No categories yet.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {categories.map((cat) => {
            const used = cat._count?.shipments ?? 0
            const isEditing = editingId === cat.id
            return (
              <div key={cat.id} className="py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">{cat.name}</p>
                      {!cat.is_active && (
                        <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                          {cat.archived ? 'Archived' : 'Inactive'}
                        </span>
                      )}
                      {cat.surcharge && (
                        <span className="shrink-0 rounded-full bg-[#4043FF]/10 px-2 py-0.5 text-[10px] font-semibold text-[#4043FF]">
                          ₦{cat.surcharge.cost_per_kg.toLocaleString()}/kg
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate font-mono text-[11px] text-gray-400" title={cat.code}>{cat.code}</p>
                    {cat.description && (
                      <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{cat.description}</p>
                    )}
                    <p className="mt-0.5 text-[11px] text-gray-400">
                      {used} shipment{used === 1 ? '' : 's'}
                    </p>
                  </div>

                  {!isEditing && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleActive(cat)}
                        disabled={busy}
                        title={cat.is_active ? 'Deactivate (hide from booking)' : 'Activate'}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      >
                        {cat.is_active ? <Archive className="h-4 w-4" /> : <ArchiveRestore className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => startEdit(cat)}
                        disabled={busy}
                        aria-label="Edit"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
                        disabled={busy}
                        aria-label="Delete"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-destructive hover:bg-destructive/10 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="mt-3 flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      disabled={busy}
                      className="h-9 flex-1 rounded-md border border-gray-300 px-3 text-sm focus:border-[#4043FF] focus:outline-none focus:ring-2 focus:ring-[#4043FF]/30"
                    />
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description"
                      disabled={busy}
                      className="h-9 flex-[1.4] rounded-md border border-gray-300 px-3 text-sm focus:border-[#4043FF] focus:outline-none focus:ring-2 focus:ring-[#4043FF]/30"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => saveEdit(cat.id)}
                        disabled={busy}
                        aria-label="Save"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#4043FF] text-white disabled:opacity-50"
                      >
                        {updateCategory.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        aria-label="Cancel"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
