import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { AntdProvider } from "@/providers/antd-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Tickets — Support Dashboard",
  description: "Manage support tickets and responses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Work+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased flex min-h-screen flex-col">
        <AntdProvider>
          <AuthProvider>
            <QueryProvider>
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </QueryProvider>
          </AuthProvider>
        </AntdProvider>
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}
