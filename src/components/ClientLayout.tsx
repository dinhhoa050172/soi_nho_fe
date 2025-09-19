'use client';

import ReduxProvider from '@/provider/ReduxProvider';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return <ReduxProvider>{children}</ReduxProvider>;
}