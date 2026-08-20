'use client'

import { ReactNode } from 'react'

interface AdminModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
    maxWidth?: string
}

export function AdminModal({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }: AdminModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/30"
                onClick={onClose}
            />
            <div className={`relative bg-white rounded-lg shadow-xl w-full ${maxWidth} overflow-hidden max-h-[90vh] overflow-y-auto`}>
                <div className="bg-[#4043FF] px-4 py-3 flex items-center justify-between sticky top-0">
                    <h2 className="text-white font-semibold text-sm lg:text-base">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-white/80 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}
