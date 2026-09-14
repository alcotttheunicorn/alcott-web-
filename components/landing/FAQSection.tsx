'use client'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'

const FAQ_ITEMS = [
    {
        question: 'How do I get a quote for shipping?',
        answer: 'You can get a shipping quote by using our "Check Rates" form on the homepage. Simply enter your pickup and delivery addresses, package weight, and we\'ll provide you with an instant quote. You can also contact our customer service team for personalized quotes.',
    },
    {
        question: 'How long does the shipping take?',
        answer: 'Shipping times vary depending on the destination and service type. Local deliveries within Lagos typically take 1-2 days, interstate deliveries take 2-5 days, and international shipments can take 5-14 days. You\'ll receive an estimated delivery time when you book your shipment.',
    },
    {
        question: 'Where can i ship foodstuff to?',
        answer: 'We ship foodstuff to most locations within Nigeria and select international destinations. However, some countries have restrictions on certain food items. Please check our food shipping guidelines or contact our team to confirm if your specific food items can be shipped to your desired destination.',
    },
    {
        question: 'What food stuff can I not ship?',
        answer: 'We cannot ship perishable items that require refrigeration, liquids in glass containers, alcohol, tobacco products, or any items that violate international shipping regulations. For a complete list of restricted items, please refer to our shipping guidelines or contact our customer service team.',
    },
    {
        question: 'What is the price of cargo shipping?',
        answer: 'Cargo shipping prices are calculated based on weight, dimensions, destination, and service type. Our pricing is competitive and transparent. Use our online quote calculator for instant pricing, or contact our sales team for bulk shipping rates and custom solutions.',
    },
    {
        question: 'How much is the custom duties charge?',
        answer: 'Custom duties are determined by the destination country\'s customs regulations and are not included in our shipping fees. Duties are typically calculated as a percentage of the declared value of your package. We can provide estimates, but final duty charges are determined by customs authorities at the destination.',
    },
    {
        question: 'How can I use the web app?',
        answer: 'Our web app is easy to use! Simply create an account, log in, and you can book shipments, track packages, manage your profile, and access all our services. The interface is intuitive and mobile-friendly, so you can manage your shipments from anywhere, anytime.',
    },
]

export function FAQSection() {
    return (
        <section className="bg-white py-20">
            <div className="max-w-8xl mx-auto px-4 lg:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                        Got questions? We have answers for you
                    </h2>
                    <p className="text-lg text-gray-600">
                        Everything you need to know about our shipping, pricing and platform.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {FAQ_ITEMS.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index + 1}`} className="border-b border-gray-200">
                            <AccordionTrigger className="text-left text-gray-700 hover:text-[#4043FF] transition-colors">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 pt-4">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}
