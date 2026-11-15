import { requireSession } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

import type { KitchenTicket, KitchenTicketItem } from "@/types/database.types";

import type { UiKitchenTicket, UiKitchenTicketItem } from "@/features/kitchen/types/kitchen.types";

type KitchenTicketRow = KitchenTicket & {
  kitchen_ticket_items: KitchenTicketItem[];
};

const OPEN_STATUSES = ["NEW", "IN_PROGRESS", "READY"] as const;

function mapKitchenTicketItem(row: KitchenTicketItem): UiKitchenTicketItem {
  return {
    id: row.id,
    saleItemId: row.sale_item_id,
    productId: row.product_id,
    productName: row.product_name,
    quantity: row.quantity,
    lineNote: row.line_note,
  };
}

function mapKitchenTicket(row: KitchenTicketRow): UiKitchenTicket {
  const items = (row.kitchen_ticket_items ?? []).map(mapKitchenTicketItem);
  items.sort((a, b) => a.productName.localeCompare(b.productName));

  return {
    id: row.id,
    saleId: row.sale_id,
    ticketNumber: row.ticket_number,
    status: row.status,
    notes: row.notes,
    firedAt: row.fired_at,
    startedAt: row.started_at,
    readyAt: row.ready_at,
    doneAt: row.done_at,
    items,
  };
}

export async function listOpenKitchenTickets(): Promise<UiKitchenTicket[]> {
  const session = await requireSession();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("kitchen_tickets")
    .select("*, kitchen_ticket_items(*)")
    .eq("organization_id", session.organization.id)
    .in("status", [...OPEN_STATUSES])
    .order("fired_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as KitchenTicketRow[]).map(mapKitchenTicket);
}