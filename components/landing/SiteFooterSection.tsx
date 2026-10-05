import Link from 'next/link'

const companyLinks = ['About', 'Features', 'Works', 'Career']
const serviceLinks = ['For Business', 'For Partners']
const helpLinks = ['Customer Support', 'Delivery Details', 'Terms & Conditions', 'Privacy Policy']

export function SiteFooterSection() {
  return (
    <footer className="w-full bg-white border-t border-gray-200" aria-label="Site footer">
      <div className="max-w-9xl mx-auto px-4 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand + description */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" aria-label="Alcott home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/alcott-small.png" alt="Alcott" className="h-8 w-auto" />
            </Link>
            <p className="text-gray-600 text-base leading-7 max-w-md ">
              Alcott is an end-to-end logistics platform for individuals and
              businesses, handling local delivery, international parcel
              shipping, freight forwarding, customs clearance,
              procurement/imports and last-mile delivery from one platform.
            </p>
          </div>

          <FooterNav title="Company" links={companyLinks} id="footer-company-heading" />
          <FooterNav title="Services" links={serviceLinks} id="footer-services-heading" />
          <FooterNav title="Help" links={helpLinks} id="footer-help-heading" />

          <section className="flex flex-col gap-4" aria-labelledby="footer-contact-heading">
            <h2 id="footer-contact-heading" className="text-gray-900 text-lg font-semibold ">
              Contact Information
            </h2>
            <address className="not-italic text-gray-600 text-base leading-7 ">
              <a href="tel:+2349060007571" className="hover:text-[#4043ff] transition-colors">+234 906 000 7571</a>
              <br />
              <a href="mailto:info@alcott.com.ng" className="hover:text-[#4043ff] transition-colors">info@alcott.com.ng</a>
            </address>
            <address className="not-italic text-gray-600 text-base leading-6 ">
              Suite 13, Departure Hall,
              <br />
              Mobolaji Johnson Train Station,
              <br />
              Alagomeji, Yaba, Lagos
            </address>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Twitter" className="text-gray-600 hover:text-[#4043ff] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="text-gray-600 hover:text-[#4043ff] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="#" aria-label="Pinterest" className="text-gray-600 hover:text-[#4043ff] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
              </svg>
            </a>
            <a href="#" aria-label="GitHub" className="text-gray-600 hover:text-[#4043ff] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-gray-600 text-[13px]" aria-label="Legal links">
            <Link href="/policies" className="hover:text-[#4043ff] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#4043ff] transition-colors">Terms &amp; Conditions</Link>
            <a href="#" className="hover:text-[#4043ff] transition-colors">Support</a>
          </nav>

          <p className="text-gray-600 text-[13px] text-center md:text-right">
            © Copyright 2023, All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterNav({ title, links, id }: { title: string; links: string[]; id: string }) {
  return (
    <nav aria-labelledby={id} className="flex flex-col gap-4">
      <h2 id={id} className="text-gray-900 text-lg font-semibold ">
        {title}
      </h2>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="text-gray-600 text-base hover:text-[#4043ff] transition-colors ">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}