'use client'

import Link from 'next/link'

export default function PoliciesPage() {
    const policies = [
        {
            id: 1,
            title: '1. Types of Data We Collect',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        },
        {
            id: 2,
            title: '2. Use of Your Personal Data',
            content: 'Magna etiam tempor orci eu lobortis elementum nibh. Vulputate enim nulla aliquet porttitor lacus. Orci sagittis eu volutpat odio. Cras semper auctor neque vitae tempus quam pellentesque nec. Non quam lacus suspendisse faucibus interdum posuere lorem ipsum dolor. Commodo elit at imperdiet dui. Nisi vitae suscipit tellus mauris a diam. Erat pellentesque adipiscing commodo elit at imperdiet dui. Mi ipsum faucibus vitae aliquet nec ullamcorper. Pellentesque pulvinar pellentesque habitant morbi tristique senectus et.',
        },
        {
            id: 3,
            title: '3. Disclosure of Your Personal Data',
            content: 'Consequat id porta nibh venenatis cras sed. Ipsum nunc aliquet bibendum enim facilisis gravida neque. Nibh tellus molestie nunc non blandit massa. Quam pellentesque nec nam aliquam sem et tortor consequat id. Faucibus vitae aliquet nec ullamcorper sit amet risus. Nunc consequat interdum varius sit amet. Eget magna fermentum iaculis eu non diam phasellus vestibulum. Pulvinar pellentesque habitant morbi tristique senectus et. Lorem donec massa sapien faucibus et molestie. Massa tempor nec feugiat nisl pretium fusce id. Lacinia at quis risus sed vulputate odio. Integer vitae justo eget magna fermentum iaculis. Eget gravida cum sociis natoque penatibus et magnis.',
        },
    ]

    return (
        <div className="p-6 lg:p-8 w-full overflow-x-hidden">
            {/* Page Header - Clean with no border */}
            <div className="flex items-center justify-between mb-8 lg:mb-10">
                <div className="flex items-center gap-2">
                    <Link href="/admin/users" className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-sm lg:text-base font-bold text-gray-900 tracking-wide">POLICIES</h1>
                </div>

                <button className="flex items-center gap-1.5 text-[#4043FF] hover:text-[#3333CC] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span className="text-sm font-medium">EDIT</span>
                </button>
            </div>

            {/* Policy Sections - with proper indentation matching screenshot */}
            <div className="space-y-8 lg:space-y-10 pl-4 lg:pl-8 pr-4 lg:pr-16 max-w-5xl">
                {policies.map((policy) => (
                    <div key={policy.id}>
                        <h2 className="text-sm lg:text-base font-bold text-gray-900 mb-3">{policy.title}</h2>
                        <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">{policy.content}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
