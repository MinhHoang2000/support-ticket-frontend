import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { AntdProvider } from "@/providers/antd-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://tickets.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tickets — Support Ticket Management & Dashboard",
    template: "%s | Tickets",
  },
  description:
    "Manage support tickets in one place. Create, track, and respond to customer requests from a simple dashboard. Built for teams who want support done right.",
  keywords: [
    "support tickets",
    "ticket management",
    "customer support",
    "help desk",
    "support dashboard",
  ],
  authors: [{ name: "Tickets" }],
  creator: "Tickets",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Tickets",
    title: "Tickets — Support Ticket Management & Dashboard",
    description:
      "Manage support tickets in one place. Create, track, and respond to customer requests from a simple dashboard.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tickets — Support Ticket Management & Dashboard",
    description:
      "Manage support tickets in one place. Create, track, and respond to customer requests from a simple dashboard.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
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
