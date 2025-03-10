import ChargeForm from "./partials/ChargeForm";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import SidebarMini from "@/layouts/partials/SidebarMini";
import { AppProvider } from "@/contexts/app-context";

export default function Charge({
  auth,
  mustVerifyEmail,
  status,
  friends,
}: PageProps<{ mustVerifyEmail: boolean; status?: string; friends: [] }>) {
  return (
    <AppProvider>
      <Head title="계좌충전" />
      <div className="py-4 sm:py-6">
        <div className="mx-auto max-w-7xl space-y-4 px-4 sm:space-y-6 sm:px-6">
          <div className="rounded-md bg-background p-4 shadow sm:p-8">
            <ChargeForm className="max-w-xl" />
          </div>
        </div>
      </div>
      <div className="fixed bottom-[0]">
        <SidebarMini />
      </div>
    </AppProvider>
  );
}
