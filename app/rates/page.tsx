'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeftRight, MapPin, Scale } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { UserAppLayout } from '@/components/layout/UserAppLayout'
import { PageHeading } from '@/components/user/page-primitives'
import { checkPricingAuth } from '@/lib/api/pricing-api'
import type { PricingResult } from '@/lib/api/types'
import { toast } from '@/components/ui/use-toast'
import { LocationAutocompleteInput } from '@/components/ui/location-autocomplete-input'

const formatMoney = (
  value: { 
    amount: number; 
    currency: string 
  } | undefined
) => value ? `${value.currency === 'NGN' ? '₦' : `${value.currency} `}${value.amount.toLocaleString()}` : '—'

function LocationField({ 
  label, 
  value, 
  onChange, 
  placeholder 
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void; 
  placeholder: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <LocationAutocompleteInput 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        containerClassName="mt-2" 
        className="w-full border rounded-lg py-3 pl-10 pr-4" 
        icon={<MapPin className="absolute left-3 top-3 text-[#4043FF] w-5 h-5 pointer-events-none" />} 
      />
    </label>
  )
}

function sanitizeWeightInput(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, '')
  const [integer, fraction] = cleaned.split('.')
  if (fraction !== undefined) {
    return `${integer}${fraction ? `.${fraction.replace(/\./g, '')}` : ''}`
  }
  return integer
}

function WeightField({ 
  weight, 
  unit, 
  onWeightChange, onUnitChange 
}: { 
  weight: string; 
  unit: 'kg' | 'lb'; 
  onWeightChange: (value: string) => void; 
  onUnitChange: (value: 'kg' | 'lb') => void }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">Weight</span>
      <div className="flex gap-2 mt-2">
        <div className="relative flex-1">
          <Scale className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input 
            value={weight} 
            onChange={(event) => onWeightChange(sanitizeWeightInput(event.target.value))} 
            inputMode="decimal" 
            className="w-full border rounded-lg py-3 pl-10 pr-4" 
            placeholder="0" 
          />
        </div>
        <select 
          value={unit} 
          onChange={(event) => onUnitChange(event.target.value as 'kg' | 'lb')} 
          className="border rounded-lg px-4"
        >
          <option>kg</option>
          <option>lb</option>
        </select>
      </div>
    </label>
  )
}

function RouteSummary({ 
  pickup, 
  destination, 
  onSwap 
}: { 
  pickup: string; 
  destination: 
  string; onSwap: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
      <div>
        <p className="text-xs text-gray-500">Pick up</p>
        <p className="font-semibold">{pickup}</p>
      </div>
      <button 
        onClick={onSwap} 
        className="p-2 text-[#4043FF]" 
        aria-label="Swap route"
      >
        <ArrowLeftRight />
      </button>
      <div className="text-right">
        <p className="text-xs text-gray-500">Destination</p>
        <p className="font-semibold">{destination}</p>
      </div>
    </div>

  )
}

function RateResult({ 
  result, 
  pickup, 
  destination, 
  onSwap 
}: { 
  result: PricingResult; 
  pickup: string; 
  destination: string; 
  onSwap: () => void 
}) { 
  const isZone = 'export_price' in result; 
  return (
    <section className="mt-8">
      <RouteSummary 
        pickup={pickup} 
        destination={destination} 
        onSwap={onSwap} 
      />
      <article className="bg-white border rounded-xl p-5">
        <p className="font-bold text-lg">{result.pricing_type}</p>
        {isZone ? 
          <div className="grid grid-cols-2 gap-4 mt-4">
            <p>Export <strong className="block text-[#4043FF]">{formatMoney(result.export_price)}</strong></p>
            <p>Import <strong className="block text-[#4043FF]">{formatMoney(result.import_price)}</strong></p>
          </div> : 
          <>
            <p className="text-2xl font-bold text-[#4043FF] mt-2">{formatMoney(result.price)}</p>
            {result.breakdown && 
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t text-sm">
                {Object.entries(result.breakdown).map(([key, value]) => 
                  <p key={key} className="flex justify-between gap-3">
                    <span className="text-gray-500">{key.replaceAll('_', ' ')}</span>
                    <span>{Number(value).toLocaleString()}</span>
                  </p>
                )}
              </div>
            }
          </>
        }
      </article>
    </section> 
  )
}

export default function CheckRatesPage() { 
  const router = useRouter(); 
  const [pickup, setPickup] = useState(''); 
  const [destination, setDestination] = useState(''); 
  const [weight, setWeight] = useState(''); 
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg'); 
  const [result, setResult] = useState<PricingResult | null>(null); 

  const mutation = useMutation({ 
    mutationFn: (
      kilograms: number) => checkPricingAuth(pickup.trim(), 
      destination.trim(), 
      kilograms
    ), 
    onSuccess: (response) => setResult(response.data), 
    onError: () => toast({ title: 'Could not fetch rates', description: 'Please try again later.' }) 
  }); 

  const submit = () => { const parsed = Number(weight); 
  if (!pickup.trim() || !destination.trim() || !Number.isFinite(parsed) || parsed <= 0) 
    return toast({ title: 'Missing information', description: 'Enter both locations and a valid weight.' }); 

  mutation.mutate(unit === 'lb' ? parsed * 0.453592 : parsed) 
}; 

return (
  <UserAppLayout contentBgClass="bg-white">
    <div className="max-w-2xl mx-auto p-4 lg:p-6">
      <PageHeading title="Check rates" onBack={() => router.back()} />
      <div className="space-y-4">
        <LocationField label="Pick up location" value={pickup} onChange={setPickup} placeholder="Enter pickup location" />
        <LocationField label="Package destination" value={destination} onChange={setDestination} placeholder="Enter destination" />
        <WeightField weight={weight} unit={unit} onWeightChange={setWeight} onUnitChange={setUnit} />
        <button 
          onClick={submit} 
          disabled={mutation.isPending} 
          className="w-full bg-[#4043FF] text-white rounded-full py-3 font-bold disabled:opacity-50"
        >
          {mutation.isPending ? 'Checking…' : 'Check rates'}
        </button>
      </div>
      {result && 
        <RateResult 
          result={result} 
          pickup={pickup} 
          destination={destination} 
          onSwap={() => { setPickup(destination); setDestination(pickup) }} 
        />
      }
    </div>
  </UserAppLayout> 
)}