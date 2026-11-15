import { exitOrganizationSupportAction } from "@/features/platform-admin/api/platform-admin.actions";
import { Button } from "@/components/ui";

interface SupportModeBannerProps {
  organizationName: string;
}

export function SupportModeBanner({
  organizationName,
}: Readonly<SupportModeBannerProps>) {
  return (
    <div className="border-b border-amber-500/40 bg-amber-500/10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <p className="text-sm text-amber-950 dark:text-amber-100">
          Support mode · viewing <span className="font-medium">{organizationName}</span>
        </p>
        <form action={exitOrganizationSupportAction}>
          <Button type="submit" size="sm" variant="outline" className="min-h-10">
            Exit support
          </Button>
        </form>
      </div>
    </div>
  );
}
