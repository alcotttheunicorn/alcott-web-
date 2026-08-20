import { GuestGuard } from '@/components/guest-guard'

export default function AuthRouteGroupLayout({ children }: { children: React.ReactNode }) {
  return <GuestGuard>{children}</GuestGuard>
}