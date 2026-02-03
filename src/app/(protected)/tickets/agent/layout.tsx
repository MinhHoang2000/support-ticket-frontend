"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";

/**
 * Restricts Agent Dashboard to users with role admin or agent.
 * If user.role is not set (API may not return it yet), allow entry;
 * GET /tickets will return 403 for non-agent users and the list page will show access denied.
 */
export default function AgentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isReady } = useAuth();

  useEffect(() => {
    if (!isReady || !user) return;
    const role = user.role;
    if (role && role !== "admin" && role !== "agent") {
      router.replace("/tickets");
    }
  }, [isReady, user, router]);

  return <>{children}</>;
}
