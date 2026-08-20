'use client'

import { Button } from '@/components/ui/button'
import { FormSection } from '@/components/shipment/FormSection'
import { SummaryCard } from '@/components/shipment/SummaryCard'
import type {
    ShipmentContact,
    ShipmentOption,
    ShipmentPackage,
    ShipmentPaymentSelection,
} from '@/lib/types/shipment-types'

interface ReviewStepProps {
    sender: ShipmentContact
    receiver: ShipmentContact
    pkg: ShipmentPackage
    shippingSelection: ShipmentOption
    payment: ShipmentPaymentSelection
    onConfirm: () => void
    isSubmitting: boolean
}

export function ReviewStep({
    sender,
    receiver,
    pkg,
    shippingSelection,
    payment,
    onConfirm,
    isSubmitting,
}: ReviewStepProps) {
    return (
        <FormSection title="Review Summary" subtitle="Confirm the details before completing the order.">
            <div className="space-y-4">
                <SummaryCard title="Sender" items={[
                    ['Name', sender.name],
                    ['Phone', sender.phone],
                    ['Email', sender.email],
                    ['Address', sender.address],
                ]} />
                <SummaryCard title="Receiver" items={[
                    ['Name', receiver.name],
                    ['Phone', receiver.phone],
                    ['Email', receiver.email],
                    ['Address', receiver.address],
                ]} />
                <SummaryCard title="Package" items={[
                    ['Category', pkg.category],
                    ['Weight', pkg.weight ? `${pkg.weight} ${pkg.weightUnit.toUpperCase()}` : ''],
                    ['Dimensions', `${pkg.length || 0} × ${pkg.width || 0} × ${pkg.height || 0} ${pkg.dimensionUnit.toUpperCase()}`],
                    ['Shipping', `${shippingSelection.label} – ₦${shippingSelection.price.toLocaleString()}`],
                ]} />
                <SummaryCard title="Payment" items={[[
                    'Method', payment.method === 'wallet' ? 'My Wallet' : 'Pay with Card'
                ]]} />
            </div>

            <div className="pt-4">
                <Button
                    onClick={onConfirm}
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-full bg-[#4043FF] hover:bg-[#3333CC] text-white font-semibold disabled:opacity-60"
                >
                    {isSubmitting ? 'Confirming…' : 'Confirm Order'}
                </Button>
            </div>
        </FormSection>
    )
}
