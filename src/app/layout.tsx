import "./globals.css";
import type { PropsWithChildren, ReactNode } from "react";
import QueryProvider from "@/components/providers/QueryProvider";
import { ToastProvider } from "@/components/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata = {
  title: "Movie App",
  description: "A modern movie management application",
  icons: {
    icon: '/movie.png', 
    apple: '/movie.png',
  },

};

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: PropsWithChildren<LayoutProps>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-text font-montserrat">
        <ErrorBoundary>
          <QueryProvider>
            <ToastProvider>
              <div className="max-w-screen-xl mx-auto px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16">
                {children}
              </div>
            </ToastProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
