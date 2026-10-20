import Link from 'next/link'

export function PageFooter() {
  return (
    <footer className="bg-[#04122b]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Link href="/" aria-label="Alcott home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/alcott-white-logo-sidebar-home.png"
            alt="Alcott"
            className="h-7 w-auto"
          />
        </Link>
        <nav
          aria-label="Footer navigation"
          className="flex items-center gap-6 text-xs text-[#cfd8ec]"
        >
          <Link href="/terms" className="hover:text-white">
            Terms
          </Link>
          <Link href="/policies" className="hover:text-white">
            Policies
          </Link>
          <Link href="/help" className="hover:text-white">
            Help
          </Link>
        </nav>
        <p className="text-xs text-[#747b8f]">
          © {new Date().getFullYear()} Alcott. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
