import Image from 'next/image';
import React from 'react';
import logo from '@/asset/logo.png';
import Link from 'next/link';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-300 py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-5xl bg-white shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row">

                {/* Logo Section */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gray-100">
                    <Link href="/">
                        <Image
                            src={logo}
                            alt="logo"
                            className="object-contain md:max-h-60 max-h-30 w-auto"
                            priority
                        />
                    </Link>
                </div>

                {/* Form Section */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
