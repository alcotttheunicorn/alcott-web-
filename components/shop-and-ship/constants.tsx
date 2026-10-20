import type { JSX } from 'react'
import {
  Calculator,
  FileText,
  Globe,
  Package,
  ShoppingCart,
  Truck,
  Weight,
  type LucideIcon,
} from 'lucide-react'

export const BRAND = '#4043FF'

export const benefits: { title: JSX.Element; icon: LucideIcon }[] = [
  { title: <>Shop any store<br />in the US &amp; UK</>, icon: ShoppingCart },
  { title: <>Get an all-in<br />cost estimate</>, icon: Calculator },
  { title: <>We handle shipping,<br />customs and delivery</>, icon: Package },
]

export const storeLogos: { name: string; node: JSX.Element }[] = [
  {
    name: 'amazon',
    node: (
      <span className="font-bold text-[#080d20] text-base tracking-tight">
        amazon<span style={{ color: '#f5af02' }}> ›</span>
      </span>
    ),
  },
  {
    name: 'zara',
    node: <span className="font-semibold text-[#080d20] text-[22px] tracking-[-0.5px]">ZARA</span>,
  },
  {
    name: 'apple',
    node: (
      <svg width="16" height="20" viewBox="0 0 172 175" fill="#080d20" aria-hidden="true">
        <path d="M117.5 90.5c0-14.5 11.5-22 12-22.5-6.5-9.5-16.5-11-20-11-9-.5-16 5-20 5s-10.5-5-17.5-5c-9 0-17 5-21.5 13-9 16-2.5 40 6.5 53 4.5 6.5 9.5 13.5 16.5 13 6.5-.5 9.5-4.5 17-4.5s10 4.5 17 4.5 12-6.5 16.5-13c5-7 7.5-14 7.5-14.5 0 0-14-5.5-14-24zM102 53c3.5-4.5 6-10.5 5-16.5-5 0-11.5 3.5-15 7.5-3 4-6 10-5.5 16l.5 0c5.5.5 11.5-3 15-7z" />
      </svg>
    ),
  },
  {
    name: 'nike',
    node: (
      <svg width="30" height="20" viewBox="0 0 36 24" fill="#080d20" aria-hidden="true">
        <path d="M0 21.4c.4-1.1 3.7-7.2 7.3-12.2L16.4.2l.5.3c.3.1 4.6 2.7 9.6 5.7 8.4 5.1 9.2 5.7 8.9 6.3-.2.5-2.6 3-5.4 5.5-4.3 3.8-5.3 4.4-6.2 4.1-.7-.2-4.2-1.8-7.8-3.6C11 15.5 9 14.7 7.9 15c-1.5.4-6 3.3-7.5 5-.6.7-.9.8-1.2.5-.3-.3-.1-1 .8-4.1z" />
      </svg>
    ),
  },
  {
    name: 'asos',
    node: <span className="font-bold text-[#080d20] text-[22px] tracking-tight">asos</span>,
  },
  {
    name: 'ebay',
    node: (
      <span className="font-bold text-[22px] tracking-tight">
        <span style={{ color: '#e53238' }}>e</span>
        <span style={{ color: '#0064d2' }}>b</span>
        <span style={{ color: '#f5af02' }}>a</span>
        <span style={{ color: '#86b817' }}>y</span>
      </span>
    ),
  },
]

export const consolidationFeatures: {
  title: string
  desc: JSX.Element
  icon: LucideIcon
}[] = [
  {
    title: 'Access global stores',
    desc: <>Shop from the US, UK and<br />1,000+ international retailers.</>,
    icon: Globe,
  },
  {
    title: 'Transparent pricing',
    desc: <>See the total cost — product,<br />shipping, duties and delivery.</>,
    icon: Calculator,
  },
  {
    title: 'Consolidation',
    desc: <>Combine multiple purchases<br />to save on shipping.</>,
    icon: Package,
  },
  {
    title: 'Customs support',
    desc: <>We handle documentation<br />and customs clearance.</>,
    icon: FileText,
  },
  {
    title: 'Doorstep delivery',
    desc: <>Delivery to your doorstep<br />anywhere in Nigeria.</>,
    icon: Truck,
  },
  {
    title: 'Shipment tracking',
    desc: <>Track your shipment<br />every step of the way.</>,
    icon: Weight,
  },
]

export const cartProducts = [
  { store: 'Amazon (US)', price: '$549', emoji: '🎧' },
  { store: 'Zara (UK)', price: '$89', emoji: '👕' },
  { store: 'Apple (US)', price: '$999', emoji: '📱' },
  { store: 'Nike (US)', price: '$120', emoji: '👟' },
]

export const featureItems = [
  'Extracts product information automatically',
  'Estimates package weight with high accuracy',
  'Includes shipping, duties and delivery',
  'Shows total cost before you pay',
]

export const productDetails: {
  label: string
  value: string
  confidence?: string
}[] = [
  { label: 'Product weight (from store)', value: '1.24 kg' },
  { label: 'Estimated shipping weight', value: '', confidence: '◉ 92% confidence' },
  { label: 'Estimated dimensions', value: '35 × 25 × 8 cm' },
  { label: 'Category', value: 'Electronics' },
]

export const faqs = [
  {
    q: 'How does Shop & Ship work?',
    a: 'Shop & Ship lets you purchase products from supported stores and have them delivered to your destination.',
  },
  {
    q: 'What stores can I shop from?',
    a: 'You can shop from a wide selection of supported retailers available through the Shop & Ship service.',
  },
  {
    q: 'How accurate are the cost estimates?',
    a: 'Cost estimates are calculated using the latest available shipping, tax, and handling information.',
  },
  {
    q: 'Are customs duties included in the estimate?',
    a: 'Customs duties and applicable fees are shown in the estimate whenever they can be calculated in advance.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Delivery times vary by store, destination, and shipping method selected at checkout.',
  },
  {
    q: 'What items can I not ship?',
    a: 'Restricted items include products prohibited by local regulations, carriers, or international shipping requirements.',
  },
]
