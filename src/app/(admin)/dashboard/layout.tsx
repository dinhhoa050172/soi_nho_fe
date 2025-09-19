
import { AppSidebar } from '@/components/sidebar-admin/app-siderbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="">

            <SidebarProvider>
                <AppSidebar />
                <main className='container mx-3 my-3'>
                    {children}
                </main>
            </SidebarProvider>
        </div >
    );
}
