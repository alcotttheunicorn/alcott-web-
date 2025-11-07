'use client'

import { useMemo, useState } from 'react'
import type {
  ShipmentContact,
  ShipmentFormState,
  ShipmentPackage,
  ShipmentPaymentSelection,
  ShipmentStepKey,
  ShipmentSteps,
} from '@/lib/types/shipment-types'

export interface ShipmentWizardOptions {
  steps: ShipmentSteps
  initialSender: ShipmentContact
  initialReceiver?: ShipmentContact
  initialPackage: ShipmentPackage
  initialPayment: ShipmentPaymentSelection
}

const defaultValidation: Record<ShipmentStepKey, (state: ShipmentFormState) => boolean> = {
  sender: (state) => Boolean(state.sender.name && state.sender.phone && state.sender.address),
  receiver: (state) => Boolean(state.receiver.name && state.receiver.phone && state.receiver.address),
  package: (state) => Boolean(state.package.category && state.package.description && state.package.weight),
  payment: (state) => Boolean(state.payment.method),
  finish: () => true,
}

export function useShipmentWizard({ steps, initialSender, initialReceiver, initialPackage, initialPayment }: ShipmentWizardOptions) {
  const [currentStep, setCurrentStep] = useState<ShipmentStepKey>('sender')
  const [sender, setSender] = useState<ShipmentContact>({ ...initialSender })
  const [receiver, setReceiver] = useState<ShipmentContact>({ ...(initialReceiver ?? initialSender) })
  const [pkg, setPkg] = useState<ShipmentPackage>({ ...initialPackage })
  const [payment, setPayment] = useState<ShipmentPaymentSelection>({ ...initialPayment })

  const activeIndex = useMemo(() => steps.findIndex((step) => step.key === currentStep), [currentStep, steps])

  const state: ShipmentFormState = {
    sender,
    receiver,
    package: pkg,
    payment,
  }

  const canMoveForward = useMemo(() => {
    const validator = defaultValidation[currentStep]
    return validator ? validator(state) : true
  }, [currentStep, state])

  const moveToStep = (step: ShipmentStepKey) => setCurrentStep(step)

  const moveToNext = () => {
    const next = steps[activeIndex + 1]
    if (next) setCurrentStep(next.key)
  }

  const moveToPrevious = () => {
    const prev = steps[activeIndex - 1]
    if (prev) setCurrentStep(prev.key)
  }

  return {
    steps,
    currentStep,
    activeIndex,
    canMoveForward,
    moveToStep,
    moveToNext,
    moveToPrevious,
    sender,
    setSender,
    receiver,
    setReceiver,
    pkg,
    setPkg,
    payment,
    setPayment,
    state,
  }
}

