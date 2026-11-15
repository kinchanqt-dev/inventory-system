"use client";

import { PosCartPanel } from "@/features/pos/components/pos-cart-panel";
import { PosMobileCart } from "@/features/pos/components/pos-mobile-cart";
import { PosProductGrid } from "@/features/pos/components/pos-product-grid";
import { usePosTerminal } from "@/features/pos/hooks/use-pos-terminal.hooks";
import { SaleReceiptDialog } from "@/features/sales/components/sale-receipt-dialog";

import type { PosProduct } from "@/features/pos/types/pos-product.types";

interface PosTerminalProps {
  products: PosProduct[];
  shopName: string;
}

export function PosTerminal({
  products,
  shopName,
}: Readonly<PosTerminalProps>) {
  const pos = usePosTerminal(products);

  return (
    <div className="relative">
      <div className="grid gap-4 md:grid-cols-pos md:gap-5 lg:gap-6">
        <PosProductGrid
          products={pos.filteredProducts}
          query={pos.query}
          categories={pos.categories}
          selectedCategory={pos.selectedCategory}
          onQueryChange={pos.setQuery}
          onCategoryChange={pos.setSelectedCategory}
          onAdd={pos.addToCart}
        />
        <div className="hidden md:block">
          <PosCartPanel {...pos.cartPanelProps} />
        </div>
      </div>

      <PosMobileCart
        open={pos.cartOpen}
        onOpenChange={pos.setCartOpen}
        itemCount={pos.itemCount}
        subtotalCents={pos.subtotalCents}
        cartPanelProps={pos.cartPanelProps}
      />

      <SaleReceiptDialog
        open={pos.receiptOpen}
        onOpenChange={pos.setReceiptOpen}
        receipt={pos.receipt}
        shopName={shopName}
        title="Sale complete"
      />
    </div>
  );
}
