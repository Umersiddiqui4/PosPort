"use client";
import { useUserDataStore } from "@/lib/store";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const user = useUserDataStore((state) => state.user);
    const isLoggedIn = useUserDataStore((state) => state.isLoggedIn);
    const pathname = usePathname();

    const [isHydrated, setIsHydrated] = useState(false);
    useEffect(() => setIsHydrated(true), []);

    if (!isHydrated) return null;

    const publicPaths = ["/helloScreen","/login", "/signup"];
    const isPublicPage = publicPaths.includes(pathname ?? "");

    // Restrict COMPANY_OWNER without companyId to only /companies-page
    if (
      isLoggedIn &&
      user?.role === "COMPANY_OWNER" &&
      !user?.companyId &&
      pathname !== "/companies-page"
    ) {
      if (typeof window !== 'undefined') window.location.href = "/companies-page";
      return null;
    }

    if (!isLoggedIn && !isPublicPage) {
        if (typeof window !== 'undefined') window.location.href = "/helloScreen";
        return null;
    }

    return <>{children}</>;
}
