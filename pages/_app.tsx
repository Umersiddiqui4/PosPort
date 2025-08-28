// pages/_app.tsx
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { CatalogProvider } from "@/lib/contexts/CatalogContext";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  // Make queryClient globally available for cache invalidation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.queryClient = queryClient
    }
  }, [queryClient])

  return (
    <QueryClientProvider client={queryClient}>
      <CatalogProvider>
        <Component {...pageProps} />
      </CatalogProvider>
    </QueryClientProvider>
  );
}
