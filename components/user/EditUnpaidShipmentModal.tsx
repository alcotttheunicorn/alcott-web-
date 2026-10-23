'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'
import { useShipmentCategories, useUpdateShipment } from '@/hooks/use-shipments'
import type { ShipmentData } from '@/lib/api/types'
import type { UpdateShipmentRequest } from '@/lib/api/shipment-api'

interface EditUnpaidShipmentModalProps {
  shipment: ShipmentData
  open: boolean
  onClose: () => void
}

// A single string field in the form. Kept as strings so inputs stay controlled
// and empty values are easy to distinguish from zero.
interface FormState {
  sender_name: string
  sender_phone_number: string
  sender_email: string
  sender_city: string
  sender_address: string
  receiver_name: string
  receiver_phone_number: string
  receiver_email: string
  receiver_city: string
  receiver_address: string
  package_category: string
  package_description: string
  package_weight: string
  package_length: string
  package_width: string
  package_height: string
  shipment_value: string
  shipment_value_currency: string
}

function toForm(shipment: ShipmentData): FormState {
  return {
    sender_name: shipment.sender_name ?? '',
    sender_phone_number: shipment.sender_phone_number ?? '',
    sender_email: shipment.sender_email ?? '',
    sender_city: shipment.sender_city ?? '',
    sender_address: shipment.sender_address ?? '',
    receiver_name: shipment.receiver_name ?? '',
    receiver_phone_number: shipment.receiver_phone_number ?? '',
    receiver_email: shipment.receiver_email ?? '',
    receiver_city: shipment.receiver_city ?? '',
    receiver_address: shipment.receiver_address ?? '',
    package_category: shipment.package_category ?? '',
    package_description: shipment.package_description ?? '',
    package_weight: shipment.package_weight != null ? String(shipment.package_weight) : '',
    package_length: shipment.package_length != null ? String(shipment.package_length) : '',
    package_width: shipment.package_width != null ? String(shipment.package_width) : '',
    package_height: shipment.package_height != null ? String(shipment.package_height) : '',
    shipment_value: shipment.shipment_value != null ? String(shipment.shipment_value) : '',
    shipment_value_currency: shipment.shipment_value_currency ?? 'NGN',
  }
}

const inputClass =
  'w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-[#4043FF] focus:outline-none focus:ring-2 focus:ring-[#4043FF]/30'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-gray-600">{label}</span>
      {children}
    </label>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">{children}</h3>
}

export function EditUnpaidShipmentModal({ shipment, open, onClose }: EditUnpaidShipmentModalProps) {
  const updateShipment = useUpdateShipment()
  const { data: categories = [] } = useShipmentCategories()
  const [form, setForm] = useState<FormState>(() => toForm(shipment))

  // Re-seed the form every time the modal opens so it reflects the latest row.
  useEffect(() => {
    if (open) setForm(toForm(shipment))
  }, [open, shipment])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSave = () => {
    // Required free-text fields the backend rejects when blank.
    const required: Array<[keyof FormState, string]> = [
      ['sender_name', 'Sender name'],
      ['sender_phone_number', 'Sender phone'],
      ['sender_address', 'Sender address'],
      ['receiver_name', 'Receiver name'],
      ['receiver_phone_number', 'Receiver phone'],
      ['receiver_address', 'Receiver address'],
    ]
    const missing = required.find(([key]) => !form[key].trim())
    if (missing) {
      toast({ title: 'Missing details', description: `${missing[1]} is required.` })
      return
    }

    const weight = parseFloat(form.package_weight)
    if (!Number.isFinite(weight) || weight <= 0) {
      toast({ title: 'Invalid weight', description: 'Enter a positive package weight.' })
      return
    }

    const declared = parseFloat(form.shipment_value)
    if (!Number.isFinite(declared) || declared < 0) {
      toast({ title: 'Invalid declared value', description: 'Enter a valid, non-negative declared value.' })
      return
    }

    const toDim = (value: string) => {
      const parsed = parseFloat(value)
      return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined
    }

    const payload: UpdateShipmentRequest = {
      sender_name: form.sender_name.trim(),
      sender_phone_number: form.sender_phone_number.trim(),
      sender_email: form.sender_email.trim() || undefined,
      sender_city: form.sender_city.trim() || undefined,
      sender_address: form.sender_address.trim(),
      receiver_name: form.receiver_name.trim(),
      receiver_phone_number: form.receiver_phone_number.trim(),
      receiver_email: form.receiver_email.trim() || undefined,
      receiver_city: form.receiver_city.trim() || undefined,
      receiver_address: form.receiver_address.trim(),
      package_category: (form.package_category || 'OTHER').trim().toUpperCase(),
      package_description: form.package_description.trim() || null,
      package_weight: weight,
      shipment_value: declared,
      shipment_value_currency: form.shipment_value_currency || 'NGN',
    }
    const length = toDim(form.package_length)
    const width = toDim(form.package_width)
    const height = toDim(form.package_height)
    if (length != null) payload.package_length = length
    if (width != null) payload.package_width = width
    if (height != null) payload.package_height = height

    updateShipment.mutate(
      { id: shipment.id!, payload },
      {
        onSuccess: () => {
          toast({
            title: 'Order updated',
            description: 'Your changes were saved. The price was refreshed if the route or weight changed.',
          })
          onClose()
        },
        onError: (err) => {
          const message =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            'Could not save your changes. Please try again.'
          toast({ title: 'Update failed', description: message })
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next && !updateShipment.isPending) onClose() }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit order</DialogTitle>
          <DialogDescription>
            Update the details for this unpaid order. Editing the route or weight may change the quoted price.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-1">
          <div className="space-y-3">
            <SectionTitle>Sender</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Name">
                <input className={inputClass} value={form.sender_name} onChange={(e) => set('sender_name', e.target.value)} />
              </Field>
              <Field label="Phone">
                <input className={inputClass} value={form.sender_phone_number} onChange={(e) => set('sender_phone_number', e.target.value)} />
              </Field>
              <Field label="Email">
                <input className={inputClass} value={form.sender_email} onChange={(e) => set('sender_email', e.target.value)} />
              </Field>
              <Field label="City">
                <input className={inputClass} value={form.sender_city} onChange={(e) => set('sender_city', e.target.value)} />
              </Field>
            </div>
            <Field label="Address">
              <input className={inputClass} value={form.sender_address} onChange={(e) => set('sender_address', e.target.value)} />
            </Field>
          </div>

          <div className="space-y-3">
            <SectionTitle>Receiver</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Name">
                <input className={inputClass} value={form.receiver_name} onChange={(e) => set('receiver_name', e.target.value)} />
              </Field>
              <Field label="Phone">
                <input className={inputClass} value={form.receiver_phone_number} onChange={(e) => set('receiver_phone_number', e.target.value)} />
              </Field>
              <Field label="Email">
                <input className={inputClass} value={form.receiver_email} onChange={(e) => set('receiver_email', e.target.value)} />
              </Field>
              <Field label="City">
                <input className={inputClass} value={form.receiver_city} onChange={(e) => set('receiver_city', e.target.value)} />
              </Field>
            </div>
            <Field label="Address">
              <input className={inputClass} value={form.receiver_address} onChange={(e) => set('receiver_address', e.target.value)} />
            </Field>
          </div>

          <div className="space-y-3">
            <SectionTitle>Package</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Category">
                <select
                  className={inputClass}
                  value={form.package_category}
                  onChange={(e) => set('package_category', e.target.value)}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Weight (kg)">
                <input className={inputClass} inputMode="decimal" value={form.package_weight} onChange={(e) => set('package_weight', e.target.value)} />
              </Field>
            </div>
            <Field label="Description">
              <textarea
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#4043FF] focus:outline-none focus:ring-2 focus:ring-[#4043FF]/30"
                rows={2}
                value={form.package_description}
                onChange={(e) => set('package_description', e.target.value)}
              />
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Length (cm)">
                <input className={inputClass} inputMode="decimal" value={form.package_length} onChange={(e) => set('package_length', e.target.value)} />
              </Field>
              <Field label="Width (cm)">
                <input className={inputClass} inputMode="decimal" value={form.package_width} onChange={(e) => set('package_width', e.target.value)} />
              </Field>
              <Field label="Height (cm)">
                <input className={inputClass} inputMode="decimal" value={form.package_height} onChange={(e) => set('package_height', e.target.value)} />
              </Field>
            </div>
          </div>

          <div className="space-y-3">
            <SectionTitle>Declared value</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
              <Field label="Value">
                <input className={inputClass} inputMode="decimal" value={form.shipment_value} onChange={(e) => set('shipment_value', e.target.value)} />
              </Field>
              <Field label="Currency">
                <select
                  className={inputClass}
                  value={form.shipment_value_currency}
                  onChange={(e) => set('shipment_value_currency', e.target.value)}
                >
                  <option value="NGN">NGN</option>
                  <option value="USD">USD</option>
                  {/* <option value="GBP">GBP</option>
                  <option value="EUR">EUR</option> */}
                </select>
              </Field>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <button
            type="button"
            onClick={onClose}
            disabled={updateShipment.isPending}
            className="h-10 rounded-md border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={updateShipment.isPending}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#4043FF] px-4 text-sm font-semibold text-white hover:bg-[#3333CC] disabled:opacity-50"
          >
            {updateShipment.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save changes
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
