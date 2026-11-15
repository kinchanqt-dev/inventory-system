"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

import {
  bumpKitchenTicketStatusAction,
  cancelKitchenTicketAction,
} from "@/features/kitchen/api/kitchen.actions";
import { KitchenTicketCard } from "@/features/kitchen/components/kitchen-ticket-card";

import type { KitchenTicketStatus } from "@/types/database.types";

import type { UiKitchenTicket } from "@/features/kitchen/types/kitchen.types";

interface KitchenBoardProps {
  organizationId: string;
  initialTickets: UiKitchenTicket[];
}

const COLUMNS: {
  status: KitchenTicketStatus;
  title: string;
  description: string;
}[] = [
  { status: "NEW", title: "New", description: "Just fired" },
  {
    status: "IN_PROGRESS",
    title: "Cooking",
    description: "On the line",
  },
  { status: "READY", title: "Ready", description: "For pickup" },
];

export function KitchenBoard({
  organizationId,
  initialTickets,
}: Readonly<KitchenBoardProps>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [bumpingTicketId, setBumpingTicketId] = useState<string | null>(null);

  const ticketsByStatus = useMemo(() => {
    const grouped: Record<string, UiKitchenTicket[]> = {
      NEW: [],
      IN_PROGRESS: [],
      READY: [],
    };
    for (const ticket of initialTickets) {
      if (grouped[ticket.status]) {
        grouped[ticket.status].push(ticket);
      }
    }
    return grouped;
  }, [initialTickets]);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    const supabase = createClient();
    let pollId: number | undefined;

    const channel = supabase
      .channel(`kitchen-tickets-${organizationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "kitchen_tickets",
          filter: `organization_id=eq.${organizationId}`,
        },
        () => {
          refresh();
        },
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          pollId ??= window.setInterval(refresh, 5000);
        }
      });

    return () => {
      if (pollId !== undefined) {
        window.clearInterval(pollId);
      }
      void supabase.removeChannel(channel);
    };
  }, [organizationId, refresh]);

  function handleBump(ticketId: string) {
    setBumpingTicketId(ticketId);
    startTransition(async () => {
      const result = await bumpKitchenTicketStatusAction(ticketId);
      setBumpingTicketId(null);
      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }
      refresh();
    });
  }

  function handleCancel(ticketId: string) {
    setBumpingTicketId(ticketId);
    startTransition(async () => {
      const result = await cancelKitchenTicketAction(ticketId);
      setBumpingTicketId(null);
      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Ticket cancelled");
      refresh();
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
      {COLUMNS.map((column) => {
        const tickets = ticketsByStatus[column.status] ?? [];
        return (
          <section
            key={column.status}
            className="flex min-h-kitchen-column flex-col rounded-2xl border bg-muted/30 p-3 sm:p-4"
          >
            <header className="mb-3 flex items-baseline justify-between gap-2 px-1">
              <div>
                <h2 className="text-xl font-semibold">{column.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {column.description}
                </p>
              </div>
              <span
                className={cn(
                  "flex min-h-9 min-w-9 items-center justify-center rounded-full bg-background text-sm font-semibold tabular-nums shadow-sm",
                )}
              >
                {tickets.length}
              </span>
            </header>
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
              {tickets.length === 0 ? (
                <p className="px-1 py-8 text-center text-sm text-muted-foreground">
                  No tickets
                </p>
              ) : (
                tickets.map((ticket) => (
                  <KitchenTicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onBump={handleBump}
                    onCancel={
                      column.status === "READY" ? undefined : handleCancel
                    }
                    isPending={isPending && bumpingTicketId === ticket.id}
                  />
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}