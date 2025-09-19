
import { SidebarCustomer } from '@/components/sidebar-customer/sidebar-customer';
import { SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="">

            <SidebarProvider>
                <SidebarCustomer />
                <main className='container mx-3 my-3'>
                    {children}
                </main>
            </SidebarProvider>
        </div >
    );
}
