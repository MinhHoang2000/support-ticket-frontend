import { redirect } from "next/navigation";

/** Redirect /agent/tickets to /agent/tickets/dashboard */
export default function AgentTicketsPage() {
  redirect("/agent/tickets/dashboard");
}
