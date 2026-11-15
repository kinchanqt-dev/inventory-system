export interface PosProduct {
  id: string;
  sku: string;
  name: string;
  priceCents: number;
  imagePath?: string | null;
  stock: { quantity: number } | null;
  category: { name: string } | null;
}