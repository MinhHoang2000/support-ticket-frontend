import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://tickets.example.com";

export const metadata: Metadata = {
  title: "Tickets — Support Ticket Management & Dashboard",
  description:
    "Manage support tickets in one place. Create, track, and respond to customer requests from a simple dashboard. Built for teams who want support done right.",
  openGraph: {
    title: "Tickets — Support Ticket Management & Dashboard",
    description:
      "Manage support tickets in one place. Create, track, and respond to customer requests from a simple dashboard.",
    url: "/",
  },
  twitter: {
    title: "Tickets — Support Ticket Management & Dashboard",
    description:
      "Manage support tickets in one place. Create, track, and respond to customer requests from a simple dashboard.",
  },
  alternates: { canonical: "/" },
};

const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Tickets",
  description:
    "Manage support tickets in one place. Create, track, and respond to customer requests from a simple dashboard. Built for teams who want support done right.",
  url: siteUrl,
  applicationCategory: "BusinessApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Tickets",
  url: siteUrl,
  description:
    "Support ticket management and dashboard for teams. Create, track, and respond to customer requests in one place.",
};

export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      {children}
    </>
  );
}
