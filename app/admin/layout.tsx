'use client'

import { useState } from 'react'
import { RoleGuard } from '@/components/role-guard'
import { Sidebar } from '@/components/admin/Sidebar'
import { Header } from '@/components/admin/Header'
import { MobileNav } from '@/components/admin/MobileNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </RoleGuard>
    )
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <div className="min-h-screen bg-[#F8F9FC] flex w-full overflow-x-hidden" style={{ fontFamily: "'Urbanist', sans-serif" }}>
            <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            <div className="flex-1 lg:ml-56 flex flex-col">
                <Header setMobileMenuOpen={setMobileMenuOpen} />

                {/* Page Content */}
                <main className="flex-1 overflow-auto pb-20 lg:pb-0">
                    {children}
                </main>

                <MobileNav setMobileMenuOpen={setMobileMenuOpen} />
            </div>
        </div>
    )
}