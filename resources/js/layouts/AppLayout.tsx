import { AppProvider } from "@/contexts/app-context";
import { PageProps } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import clsx from "clsx";

export default function AppLayout({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  const { notification_count, notification_count_group } =
    usePage<PageProps>().props;

  return (
    <AppProvider>
      <Head
        title={clsx(
          notification_count + notification_count_group > 0 &&
            `(${notification_count + notification_count_group})`,
          title,
        )}
      />
      <div className="relative">
        <div className="flex h-screen flex-col overflow-visible bg-background text-foreground sm:flex-row">
          {children}
        </div>
      </div>
    </AppProvider>
  );
}
