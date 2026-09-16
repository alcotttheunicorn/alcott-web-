'use client'

import type { ComponentType, SVGProps } from 'react'

export type UserNavKey = 'home' | 'orders' | 'inbox' | 'settings'

function DashboardIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} viewBox="0 0 31 31" fill="none"  xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.91583 0H9.12667C11.3004 0 13.0425 1.77292 13.0425 3.94821V9.20375C13.0425 11.3929 11.3004 13.1504 9.12667 13.1504H3.91583C1.7575 13.1504 0 11.3929 0 9.20375V3.94821C0 1.77292 1.7575 0 3.91583 0ZM3.91583 17.6825H9.12667C11.3004 17.6825 13.0425 19.4415 13.0425 21.6307V26.8862C13.0425 29.06 11.3004 30.8329 9.12667 30.8329H3.91583C1.7575 30.8329 0 29.06 0 26.8862V21.6307C0 19.4415 1.7575 17.6825 3.91583 17.6825ZM26.9177 0H21.7068C19.5331 0 17.791 1.77292 17.791 3.94821V9.20375C17.791 11.3929 19.5331 13.1504 21.7068 13.1504H26.9177C29.076 13.1504 30.8335 11.3929 30.8335 9.20375V3.94821C30.8335 1.77292 29.076 0 26.9177 0ZM21.7068 17.6825H26.9177C29.076 17.6825 30.8335 19.4415 30.8335 21.6307V26.8862C30.8335 29.06 29.076 30.8329 26.9177 30.8329H21.7068C19.5331 30.8329 17.791 29.06 17.791 26.8862V21.6307C17.791 19.4415 19.5331 17.6825 21.7068 17.6825Z" fill="white"/>
        </svg>
    )
}

function OrderIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} viewBox="0 0 29 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.7011 22.0218H8.57031" stroke="#E0DDDD" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19.7011 15.5677H8.57031" stroke="#E0DDDD" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12.8176 9.12874H8.57031" stroke="#E0DDDD" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M19.9936 1.25C19.9936 1.25 8.15821 1.25617 8.13971 1.25617C3.88471 1.28238 1.25 4.08204 1.25 8.35246V22.5296C1.25 26.8216 3.90475 29.6321 8.19675 29.6321C8.19675 29.6321 20.0306 29.6275 20.0506 29.6275C24.3056 29.6013 26.9419 26.8 26.9419 22.5296V8.35246C26.9419 4.06046 24.2856 1.25 19.9936 1.25Z" stroke="#E0DDDD" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
}

function InboxIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M27.5683 27.566C22.8568 32.2781 15.8801 33.2962 10.1707 30.6558C9.32788 30.3164 8.63687 30.0422 7.97995 30.0422C6.15017 30.053 3.87263 31.8272 2.68893 30.6449C1.50523 29.4611 3.28078 27.1818 3.28078 25.3409C3.28078 24.6839 3.01739 24.0052 2.67808 23.1608C0.0364473 17.4523 1.05592 10.4733 5.76748 5.76278C11.782 -0.254001 21.5538 -0.254 27.5683 5.76123C33.5938 11.7873 33.5829 21.5508 27.5683 27.566Z" stroke="#E0DDDD" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22.7405 17.3031H22.7543" stroke="#E0DDDD" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16.553 17.3031H16.5668" stroke="#E0DDDD" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.3733 17.3031H10.3871" stroke="#E0DDDD" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
}

function SettingsIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} viewBox="0 0 25 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.3045 20.5698C6.3419 20.5698 1.25 21.4713 1.25 25.0818C1.25 28.6922 6.3096 29.626 12.3045 29.626C18.2671 29.626 23.3575 28.723 23.3575 25.1141C23.3575 21.5051 18.2994 20.5698 12.3045 20.5698Z" stroke="#E0DDDD" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.3046 15.4201C16.2175 15.4201 19.3889 12.2472 19.3889 8.33433C19.3889 4.42143 16.2175 1.25 12.3046 1.25C8.39169 1.25 5.21879 4.42143 5.21879 8.33433C5.20558 12.234 8.35645 15.4069 12.2547 15.4201H12.3046Z" stroke="#E0DDDD" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
}

export const NAV_ITEMS: { key: UserNavKey; href: string; label: string; icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
    { key: 'home', href: '/home', label: 'Dashboard', icon: DashboardIcon },
    { key: 'orders', href: '/orders', label: 'My Order', icon: OrderIcon },
    { key: 'inbox', href: '/inbox', label: 'Inbox', icon: InboxIcon },
    { key: 'settings', href: '/settings', label: 'Settings', icon: SettingsIcon },
]
