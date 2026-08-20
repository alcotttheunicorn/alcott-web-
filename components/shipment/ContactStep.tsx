'use client'

import { FormSection } from '@/components/shipment/FormSection'
import { InputRow } from '@/components/shipment/InputRow'
import { TextareaRow } from '@/components/shipment/TextareaRow'
import { ContinueButton } from '@/components/shipment/ContinueButton'
import type { ShipmentContact } from '@/lib/types/shipment-types'

interface ContactStepProps {
    variant: 'sender' | 'receiver'
    data: ShipmentContact
    onChange: (value: ShipmentContact) => void
    onContinue: () => void
    canContinue: boolean
    sanitizePhone: (value: string) => string
}

export function ContactStep({ variant, data, onChange, onContinue, canContinue, sanitizePhone }: ContactStepProps) {
    const title = variant === 'sender' ? 'Sender Details' : 'Receiver Details'
    const subtitle = variant === 'sender' ? 'Who is sending this package?' : 'Who will receive this package?'

    return (
        <FormSection title={title} subtitle={subtitle}>
            <InputRow
                label={variant === 'sender' ? 'Sender Name' : 'Receiver Name'}
                placeholder={variant === 'sender' ? 'Sender Name' : 'Receiver Name'}
                value={data.name}
                onChange={(value) => onChange({ ...data, name: value })}
            />
            <InputRow
                label="Phone Number"
                placeholder="Phone Number"
                value={data.phone}
                onChange={(value) => onChange({ ...data, phone: value })}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={20}
                pattern="[0-9+]*"
                transform={sanitizePhone}
            />
            <InputRow label="Email" placeholder="Email" type="email" value={data.email} onChange={(value) => onChange({ ...data, email: value })} />
            <InputRow label="City / Province" placeholder="City / Province" value={data.city} onChange={(value) => onChange({ ...data, city: value })} />
            <TextareaRow label="Address Details" placeholder="Address Details" value={data.address} onChange={(value) => onChange({ ...data, address: value })} />
            <ContinueButton onClick={onContinue} label="Continue" disabled={!canContinue} />
        </FormSection>
    )
}
