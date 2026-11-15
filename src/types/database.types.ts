export type OrgRole = "OWNER" | "CASHIER" | "COOK";
export type CategoryKind = "menu" | "ingredient";
export type PaymentMethod =
  | "CASH"
  | "QRPH"
  | "GCASH"
  | "MAYA"
  | "CARD"
  | "OTHER";
export type SaleStatus = "COMPLETED" | "VOIDED" | "REFUNDED";
export type KitchenTicketStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "READY"
  | "DONE"
  | "CANCELLED";

export type OrganizationStatus = "active" | "suspended";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  industry: string;
  shop_title: string;
  tagline: string | null;
  logo_path: string | null;
  primary_color: string;
  accent_color: string;
  background_color: string;
  status?: OrganizationStatus;
  currency_symbol?: string;
  sales_tax_bps?: number;
  prices_include_tax?: boolean;
  target_food_cost_bps?: number;
  dashboard_year?: number;
  created_at: string;
  updated_at: string;
}

export interface PlatformAuditLog {
  id: string;
  actor_user_id: string;
  action: string;
  target_type: string;
  target_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Category {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  kind?: CategoryKind;
  created_at: string;
  updated_at: string;
}

export interface Ingredient {
  id: string;
  organization_id: string;
  name: string;
  category_id: string | null;
  supplier: string | null;
  pack_price_cents: number;
  pack_size: number;
  pack_unit: string;
  yield_bps: number;
  previous_pack_price_cents: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface IngredientStock {
  id: string;
  organization_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  min_stock: number;
  updated_at: string;
}

export interface SubRecipe {
  id: string;
  organization_id: string;
  name: string;
  batch_qty: number;
  batch_unit: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubRecipeLine {
  id: string;
  organization_id: string;
  sub_recipe_id: string;
  ingredient_id: string;
  qty: number;
  unit: string;
  sort_order: number;
}

export interface Product {
  id: string;
  organization_id: string;
  sku: string;
  barcode: string | null;
  name: string;
  description: string | null;
  image_path: string | null;
  category_id: string | null;
  price_cents: number;
  cost_cents: number;
  unit: string;
  is_active: boolean;
  portions_per_batch?: number;
  labor_cents?: number;
  packaging_cents?: number;
  allergens_notes?: string | null;
  sends_to_kitchen?: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecipeLine {
  id: string;
  organization_id: string;
  product_id: string;
  ingredient_id: string | null;
  sub_recipe_id: string | null;
  qty: number;
  unit: string;
  sort_order: number;
}

export interface StockItem {
  id: string;
  organization_id: string;
  product_id: string;
  quantity: number;
  reorder_level: number;
  updated_at: string;
}

export interface Sale {
  id: string;
  organization_id: string;
  sale_number: string;
  status: SaleStatus;
  subtotal_cents: number;
  discount_cents: number;
  total_cents: number;
  payment_method: PaymentMethod;
  payment_note: string | null;
  amount_tendered_cents: number | null;
  change_cents: number | null;
  cashier_id: string;
  void_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface KitchenTicket {
  id: string;
  organization_id: string;
  sale_id: string;
  ticket_number: string;
  status: KitchenTicketStatus;
  notes: string | null;
  fired_at: string;
  started_at: string | null;
  ready_at: string | null;
  done_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface KitchenTicketItem {
  id: string;
  organization_id: string;
  ticket_id: string;
  sale_item_id: string | null;
  product_id: string | null;
  product_name: string;
  quantity: number;
  line_note: string | null;
  created_at: string;
}

