"use client";
import { useUserDataStore } from "@/lib/store";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const user = useUserDataStore((state) => state.user);
    const isLoggedIn = useUserDataStore((state) => state.isLoggedIn);
    const pathname = usePathname();

    const [isHydrated, setIsHydrated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsHydrated(true);
        
        // Check if user is logged in from localStorage
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user-data-storage');
        
        if (token && userData && !isLoggedIn) {
            try {
                const parsedUserData = JSON.parse(userData);
                if (parsedUserData.state && parsedUserData.state.user) {
                    // Restore user session from localStorage
                    useUserDataStore.getState().login({
                        user: parsedUserData.state.user,
                        tokens: parsedUserData.state.tokens
                    });
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
        
        setIsLoading(false);
    }, [isLoggedIn]);

    if (!isHydrated || isLoading) return null;

    const publicPaths = ["/helloScreen","/login", "/signup"];
    const isPublicPage = publicPaths.includes(pathname ?? "");

    // POSPORT_ADMIN is never checked for companyId and is always allowed to navigate anywhere.
    // Restrict COMPANY_OWNER without companyId to only /companies-page
    if (
      isLoggedIn &&
      user?.role === "COMPANY_OWNER" &&
      !user?.companyId &&
      pathname !== "/companies-page" &&
      pathname !== "/companies"
    ) {
      if (typeof window !== 'undefined') window.location.href = "/companies-page";
      return null;
    }

    // Allow access to companies page even if not fully logged in (for Google OAuth flow)
    if (pathname === "/companies-page" || pathname === "/companies") {
      return <>{children}</>;
    }

    // If user has temporary Google OAuth token, allow access to companies page
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && token.startsWith('google_oauth_temp_token_') && (pathname === "/companies-page" || pathname === "/companies")) {
      return <>{children}</>;
    }

    if (!isLoggedIn && !isPublicPage) {
        if (typeof window !== 'undefined') window.location.href = "/helloScreen";
        return null;
    }

    return <>{children}</>;
}
