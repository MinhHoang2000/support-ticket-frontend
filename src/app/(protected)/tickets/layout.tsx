import { ProtectedRoute } from "@/components/protected-route";
import { TicketsHeader } from "@/components/tickets-header";

export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <TicketsHeader />
        {children}
      </div>
    </ProtectedRoute>
  );
}
