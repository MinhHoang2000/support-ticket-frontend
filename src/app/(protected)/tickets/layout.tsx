import { ProtectedRoute } from "@/components/protected-route";

export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
