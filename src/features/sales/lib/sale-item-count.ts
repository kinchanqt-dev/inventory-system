export function saleItemCount(items: { quantity: number }[] | undefined) {
  return (items ?? []).reduce((sum, item) => sum + item.quantity, 0);
}