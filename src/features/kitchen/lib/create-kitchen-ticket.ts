import { requireQueryResult } from "@/lib/require-query-result";

import { buildKitchenTicketNumber } from "@/features/kitchen/lib/kitchen-ticket-status";

import type { createClient } from "@/lib/supabase/server";
import type { CreateKitchenTicketForSaleInput } from "@/features/kitchen/types/kitchen.types";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function insertKitchenTicketForSale(
  supabase: SupabaseClient,
  input: CreateKitchenTicketForSaleInput,
) {
  const kitchenLines = input.items.filter((item) => item.sendsToKitchen);
  if (kitchenLines.length === 0) {
    return { skipped: true as const };
  }

  const { data: ticket, error: ticketError } = await supabase
    .from("kitchen_tickets")
    .insert({
      organization_id: input.orgId,
      sale_id: input.saleId,
      ticket_number: buildKitchenTicketNumber(input.saleNumber),
      status: "NEW",
    })
    .select("id, ticket_number")
    .single();

  const created = requireQueryResult(
    ticket,
    ticketError,
    "Could not create kitchen ticket",
  );

  const { error: itemsError } = await supabase.from("kitchen_ticket_items").insert(
    kitchenLines.map((line) => ({
      organization_id: input.orgId,
      ticket_id: created.id,
      sale_item_id: line.saleItemId,
      product_id: line.productId,
      product_name: line.productName,
      quantity: line.quantity,
      line_note: line.lineNote,
    })),
  );

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  return {
    success: true as const,
    ticketId: created.id,
    ticketNumber: created.ticket_number,
  };
}
