import { slugifyOrgName } from "@/lib/org-cookie";

export function slugifyCategoryName(name: string) {
  const slug = slugifyOrgName(name);
  if (slug) {
    return slug;
  }
  return "category";
}
