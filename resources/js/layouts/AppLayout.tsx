import { AppProvider } from "@/contexts/app-context";
import { PageProps } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
export default function AppLayout({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  const { notification_count, notification_count_group } =
    usePage<PageProps>().props;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMobile) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-lg text-white">
        이 웹사이트는 모바일 기기에서만 이용할 수 있습니다.
      </div>
    );
  }
  return (
    <AppProvider>
      <Head
        title={clsx(notification_count > 0 && `(${notification_count})`, title)}
      />
      <div className="relative">
        <div className="flex h-screen flex-col overflow-visible bg-background text-foreground sm:flex-row">
          {children}
        </div>
      </div>
    </AppProvider>
  );
}
