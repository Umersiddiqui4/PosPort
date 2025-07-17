"use client";
import { useAuthStore } from '@/lib/store';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const pathname = usePathname();

    const [isHydrated, setIsHydrated] = useState(false);
    useEffect(() => setIsHydrated(true), []);

    if (!isHydrated) return null;

    const publicPaths = ["/login", "/signup"];
    const isPublicPage = publicPaths.includes(pathname ?? "");

    if (!isLoggedIn && !isPublicPage) {
        if (typeof window !== 'undefined') window.location.href = "/login";
        return null;
    }

    return <>{children}</>;
}
