'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  buttonText?: string
  icon?: React.ReactNode
}

export function SuccessModal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  buttonText = "OK",
  icon 
}: SuccessModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Success Animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Main icon */}
            <div className="w-24 h-24 flex items-center justify-center relative">
              {icon || (
                <img 
                  src="/icons/success-icon.svg" 
                  alt="Success" 
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
            {title}
          </h2>
          <p className="text-gray-600 mb-8 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
            {message}
          </p>
          
          <Button 
            onClick={handleClose}
            className="bg-[#4043FF] hover:bg-[#3333CC] text-white px-8 py-3 rounded-full w-full font-[Urbanist]"
            style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  )
}
