import { ProtectedRoute } from "@/components/protected-route";

export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-full bg-background">{children}</div>
    </ProtectedRoute>
  );
}
