"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui";

import {
  formatKitchenTicketAge,
  kitchenAgeToneClass,
  kitchenBumpLabel,
} from "@/features/kitchen/lib/kitchen-ticket-card-helpers";

import type { UiKitchenTicket } from "@/features/kitchen/types/kitchen.types";

interface KitchenTicketCardProps {
  ticket: UiKitchenTicket;
  onBump: (ticketId: string) => void;
  onCancel?: (ticketId: string) => void;
  isPending?: boolean;
}

function ticketBorderClass(status: UiKitchenTicket["status"]) {
  if (status === "NEW") {
    return "border-primary/30";
  }
  if (status === "READY") {
    return "border-emerald-500/40";
  }
  return undefined;
}

function KitchenTicketItems({
  items,
}: Readonly<{ items: UiKitchenTicket["items"] }>) {
  return (
    <ul className="space-y-2 text-base">
      {items.map((item) => (
        <li key={item.id} className="flex gap-2 leading-snug">
          <span className="shrink-0 font-semibold tabular-nums">
            {item.quantity}×
          </span>
          <span className="min-w-0 flex-1">
            <span className="font-medium">{item.productName}</span>
            {item.lineNote ? (
              <span className="mt-0.5 block text-sm text-muted-foreground">
                {item.lineNote}
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

function KitchenTicketActions({
  ticketId,
  status,
  onBump,
  onCancel,
  isPending,
}: Readonly<{
  ticketId: string;
  status: UiKitchenTicket["status"];
  onBump: (ticketId: string) => void;
  onCancel?: (ticketId: string) => void;
  isPending: boolean;
}>) {
  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        className="min-h-12 w-full text-base"
        size="lg"
        disabled={isPending}
        onClick={() => onBump(ticketId)}
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin" />
            Updating…
          </>
        ) : (
          kitchenBumpLabel(status)
        )}
      </Button>
      {onCancel ? (
        <Button
          type="button"
          variant="ghost"
          className="min-h-11 w-full text-destructive"
          disabled={isPending}
          onClick={() => onCancel(ticketId)}
        >
          Cancel ticket
        </Button>
      ) : null}
    </div>
  );
}

export function KitchenTicketCard({
  ticket,
  onBump,
  onCancel,
  isPending = false,
}: Readonly<KitchenTicketCardProps>) {
  const [ageMs, setAgeMs] = useState(0);

  useEffect(() => {
    const firedAt = new Date(ticket.firedAt).getTime();

    const tick = () => {
      setAgeMs(Date.now() - firedAt);
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [ticket.firedAt]);

  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm",
        ticketBorderClass(ticket.status),
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-0.5">
          <p className="truncate text-lg font-semibold tracking-tight">
            {ticket.ticketNumber}
          </p>
          <p
            className={cn(
              "text-sm font-medium tabular-nums",
              kitchenAgeToneClass(ageMs),
            )}
          >
            {formatKitchenTicketAge(ageMs)}
          </p>
        </div>
      </header>

      <KitchenTicketItems items={ticket.items} />

      {ticket.notes ? (
        <p className="rounded-md bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
          {ticket.notes}
        </p>
      ) : null}

      <KitchenTicketActions
        ticketId={ticket.id}
        status={ticket.status}
        onBump={onBump}
        onCancel={onCancel}
        isPending={isPending}
      />
    </article>
  );
}
