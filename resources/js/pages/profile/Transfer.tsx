import TransferForm from "./partials/TransferForm";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import SidebarMini from "@/layouts/partials/SidebarMini";
import { AppProvider } from "@/contexts/app-context";
import { useScreenSize } from "@/hooks/use-screen-size";

export default function Transfer({
  auth,
  mustVerifyEmail,
  status,
  friends,
}: PageProps<{ mustVerifyEmail: boolean; status?: string; friends: [] }>) {
  const { width } = useScreenSize();
  return (
    <AppProvider>
      <Head title="계좌이채" />
      {width < 640 ? (
        <>
          <div className="min-h-[100vh] py-4 sm:py-6">
            <div className="mx-auto max-w-7xl space-y-4 px-4 sm:space-y-6 sm:px-6">
              <div className="rounded-md bg-background p-4 shadow sm:p-8">
                <div className="rounded-md bg-background p-4 shadow sm:p-8">
                  <TransferForm className="max-w-xl" friends={friends} />
                </div>
              </div>
            </div>
          </div>
          <div className="fixed bottom-[0]">
            <SidebarMini />
          </div>
        </>
      ) : (
        <>
          <div className="flex h-screen flex-col bg-background text-foreground sm:flex-row">
            <SidebarMini />
            <div className="order-3 h-screen w-full flex-1 flex-col items-center justify-center gap-4 border-l border-secondary sm:flex">
              <div className="rounded-md bg-background p-4 shadow sm:p-8">
                <TransferForm className="max-w-xl" friends={friends} />
              </div>
            </div>
          </div>
        </>
      )}
    </AppProvider>
  );
}
