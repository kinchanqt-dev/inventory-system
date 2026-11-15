import { requireSession } from "@/lib/session";

export const instant = false;

export default async function KitchenGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSession();
  return children;
}