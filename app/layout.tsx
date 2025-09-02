// app/layout.tsx
import "./globals.css";
import ProtectedLayout from "./ProtectedLayout";
import {Providers} from "./Providers";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google"
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "PosPort - Store Management System",
  description: "Streamline your store operations with our comprehensive management platform. Manage inventory, track sales, and grow your business with PosPort.",
  keywords: ["store management", "POS system", "inventory management", "retail software", "business management"],
  authors: [{ name: "Umer Siddiqui" }],
  creator: "Umer Siddiqui",
  publisher: "PosPort",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://posport.io'),
  openGraph: {
    title: "PosPort - Store Management System",
    description: "Streamline your store operations with our comprehensive management platform.",
    url: 'https://posport.io',
    siteName: 'PosPort',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PosPort Store Management System',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "PosPort - Store Management System",
    description: "Streamline your store operations with our comprehensive management platform.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
     <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true} className={inter.className}>
          <ErrorBoundary>
            <Providers>
              <ProtectedLayout>
                {children}
                <Toaster />
              </ProtectedLayout>
            </Providers>
          </ErrorBoundary>
      </body>
    </html>
  );
}
