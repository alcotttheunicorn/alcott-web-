'use client'

import { FormSection } from '@/components/shipment/FormSection'
import { ContinueButton } from '@/components/shipment/ContinueButton'
import type { ShipmentPaymentSelection } from '@/lib/types/shipment-types'

interface PaymentStepProps {
    data: ShipmentPaymentSelection
    onChange: (value: ShipmentPaymentSelection) => void
    onContinue: () => void
    canContinue: boolean
    walletBalance: number | null
}

export function PaymentStep({ data, onChange, onContinue, canContinue, walletBalance }: PaymentStepProps) {
    const balanceDisplay = walletBalance != null ? `Balance: ₦${walletBalance.toLocaleString()}` : 'Balance: ₦—'

    return (
        <FormSection title="Payment Method" subtitle="Select how you want to pay for this shipment.">
            <div className="space-y-3">
                <label
                    className={`flex items-center justify-between border rounded-xl px-4 py-3 transition-colors ${
                        data.method === 'wallet' ? 'border-[#4043FF] bg-[#4043FF]/5' : 'border-gray-200 hover:border-[#4043FF]/40'
                    }`}
                >
                    <div>
                        <p className="text-sm font-semibold text-gray-900">My Wallet</p>
                        <p className="text-xs text-gray-500">{balanceDisplay}</p>
                    </div>
                    <input
                        type="radio"
                        name="payment"
                        value="wallet"
                        checked={data.method === 'wallet'}
                        onChange={() => onChange({ method: 'wallet' })}
                        className="w-4 h-4 accent-[#4043FF]"
                    />
                </label>
                <label
                    className={`flex items-center justify-between border rounded-xl px-4 py-3 transition-colors ${
                        data.method === 'card' ? 'border-[#4043FF] bg-[#4043FF]/5' : 'border-gray-200 hover:border-[#4043FF]/40'
                    }`}
                >
                    <div>
                        <p className="text-sm font-semibold text-gray-900">Pay with Card</p>
                        <p className="text-xs text-gray-500">Paystack checkout</p>
                    </div>
                    <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={data.method === 'card'}
                        onChange={() => onChange({ method: 'card' })}
                        className="w-4 h-4 accent-[#4043FF]"
                    />
                </label>
            </div>
            <ContinueButton onClick={onContinue} label="Continue" disabled={!canContinue} />
        </FormSection>
    )
}
