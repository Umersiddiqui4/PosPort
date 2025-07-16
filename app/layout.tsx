// app/layout.tsx
import "./globals.css";
import Providers from "./Providers";
// 👈 path sahi hona chahiye

export const metadata = {
  title: "Your App",
  description: "With React Query",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
