import type { KitchenTicketStatus } from "@/types/database.types";

export interface UiKitchenTicketItem {
  id: string;
  saleItemId: string | null;
  productId: string | null;
  productName: string;
  quantity: number;
  lineNote: string | null;
}

export interface UiKitchenTicket {
  id: string;
  saleId: string;
  ticketNumber: string;
  status: KitchenTicketStatus;
  notes: string | null;
  firedAt: string;
  startedAt: string | null;
  readyAt: string | null;
  doneAt: string | null;
  items: UiKitchenTicketItem[];
}

export interface CreateKitchenTicketLineInput {
  saleItemId: string;
  productId: string;
  productName: string;
  quantity: number;
  lineNote: string | null;
  sendsToKitchen: boolean;
}

export interface CreateKitchenTicketForSaleInput {
  orgId: string;
  saleId: string;
  saleNumber: string;
  items: CreateKitchenTicketLineInput[];
}