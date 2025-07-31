import "./globals.css";
import type { PropsWithChildren } from "react";
import QueryProvider from "@/components/providers/QueryProvider";

export const metadata = {
  title: "Movie App",
  description: "A modern movie management application",
};

export default function RootLayout({ children }: PropsWithChildren<{}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-text font-montserrat">
        <QueryProvider>
          <div className="max-w-screen-xl mx-auto px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16">
            {children}
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
