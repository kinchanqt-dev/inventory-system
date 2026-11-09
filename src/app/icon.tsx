import { shopIconResponse } from "@/features/settings/lib/shop-icon-response";

export const size = {
  width: 32,
  height: 32,
};

export default function Icon() {
  return shopIconResponse(size.width);
}
