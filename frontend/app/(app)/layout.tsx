'use client';

import Navigation from "@/components/Navigation";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // Simple simulated auth check
        const auth = localStorage.getItem('mcp_auth_token');
        if (!auth && pathname !== '/login') {
            router.push('/login');
        } else {
            setIsAuthorized(true);
        }
    }, [router, pathname]);

    if (!isAuthorized) {
        return null; // Or a loading spinner
    }

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            <Navigation />
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
