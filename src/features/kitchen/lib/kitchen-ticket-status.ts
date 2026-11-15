import { buildTimedDocumentNumber } from "@/lib/document-number";

import type { KitchenTicketStatus } from "@/types/database.types";

export function buildKitchenTicketNumber(saleNumber: string): string {
  const trimmed = saleNumber.trim();
  if (!trimmed) {
    return buildTimedDocumentNumber("K");
  }
  if (trimmed.startsWith("S")) {
    return `K${trimmed.slice(1)}`;
  }
  if (trimmed.startsWith("K")) {
    return trimmed;
  }
  return `K${trimmed}`;
}

export function nextKitchenTicketStatus(
  current: KitchenTicketStatus,
): KitchenTicketStatus | null {
  switch (current) {
    case "NEW":
      return "IN_PROGRESS";
    case "IN_PROGRESS":
      return "READY";
    case "READY":
      return "DONE";
    default:
      return null;
  }
}

type StatusTransition = `${KitchenTicketStatus}->${KitchenTicketStatus}`;

const TIMESTAMP_FIELD: Partial<
  Record<StatusTransition, "started_at" | "ready_at" | "done_at">
> = {
  "NEW->IN_PROGRESS": "started_at",
  "IN_PROGRESS->READY": "ready_at",
  "READY->DONE": "done_at",
};

export function kitchenStatusTimestampPatch(
  from: KitchenTicketStatus,
  to: KitchenTicketStatus,
  now = new Date().toISOString(),
): {
  started_at?: string;
  ready_at?: string;
  done_at?: string;
} {
  const key = `${from}->${to}` as StatusTransition;
  const field = TIMESTAMP_FIELD[key];
  if (!field) {
    return {};
  }
  return { [field]: now };
}

export function isKitchenTicketFinished(status: KitchenTicketStatus) {
  return status === "DONE" || status === "CANCELLED";
}