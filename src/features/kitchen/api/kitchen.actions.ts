"use server";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

import { insertKitchenTicketForSale } from "@/features/kitchen/lib/create-kitchen-ticket";
import {
  isKitchenTicketFinished,
  kitchenStatusTimestampPatch,
  nextKitchenTicketStatus,
} from "@/features/kitchen/lib/kitchen-ticket-status";

import type { CreateKitchenTicketForSaleInput } from "@/features/kitchen/types/kitchen.types";

async function loadOrgKitchenTicket(ticketId: string, orgId: string) {
  const supabase = await createClient();
  const { data: ticket, error } = await supabase
    .from("kitchen_tickets")
    .select("id, status")
    .eq("id", ticketId)
    .eq("organization_id", orgId)
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }
  if (!ticket) {
    return { error: "Ticket not found" };
  }

  return { supabase, ticket };
}

export async function bumpKitchenTicketStatusAction(ticketId: string) {
  const session = await requireSession();
  const loaded = await loadOrgKitchenTicket(
    ticketId,
    session.organization.id,
  );
  if ("error" in loaded) {
    return { error: loaded.error };
  }

  const next = nextKitchenTicketStatus(loaded.ticket.status);
  if (!next) {
    return { error: "This ticket cannot be bumped further" };
  }

  const { error: updateError } = await loaded.supabase
    .from("kitchen_tickets")
    .update({
      status: next,
      ...kitchenStatusTimestampPatch(loaded.ticket.status, next),
    })
    .eq("id", ticketId)
    .eq("organization_id", session.organization.id);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/kitchen");
  return { success: true as const, status: next };
}

export async function cancelKitchenTicketAction(ticketId: string) {
  const session = await requireSession();
  const loaded = await loadOrgKitchenTicket(
    ticketId,
    session.organization.id,
  );
  if ("error" in loaded) {
    return { error: loaded.error };
  }

  if (isKitchenTicketFinished(loaded.ticket.status)) {
    return { error: "Ticket is already finished" };
  }

  const { error: updateError } = await loaded.supabase
    .from("kitchen_tickets")
    .update({ status: "CANCELLED" })
    .eq("id", ticketId)
    .eq("organization_id", session.organization.id);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/kitchen");
  return { success: true as const };
}

export async function createKitchenTicketForSale(
  input: CreateKitchenTicketForSaleInput,
) {
  try {
    const supabase = await createClient();
    const result = await insertKitchenTicketForSale(supabase, input);
    if ("skipped" in result) {
      return result;
    }
    revalidatePath("/kitchen");
    return result;
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Could not create kitchen ticket",
    };
  }
}
