import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import DeleteUserForm from "./partials/DeleteUserForm";
import TransferForm from "./partials/TransferForm";
import UpdatePasswordForm from "./partials/UpdatePasswordForm";
import ViewProfileInformationForm from "./partials/ViewProfileInformationForm";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import AppLayout from "@/layouts/AppLayout";
import SidebarMini from "@/layouts/partials/SidebarMini";
import Sidebar from "@/components/contacts/Sidebar";
import { AppProvider } from "@/contexts/app-context";
import { useScreenSize } from "@/hooks/use-screen-size";

export default function Edit({
  auth,
  mustVerifyEmail,
  status,
  status_type,
  friends,
}: PageProps<{
  mustVerifyEmail: boolean;
  status?: string;
  friends: [];
  status_type?: string;
}>) {
  const { width } = useScreenSize();
  console.log(status_type);
  return (
    <AppProvider>
      <Head title="나" />
      {width < 640 ? (
        <>
          <div className="min-h-[100vh] py-4 sm:py-6">
            <div className="mx-auto max-w-7xl space-y-4 px-4 sm:space-y-6 sm:px-6">
              <div className="rounded-lg bg-background p-4 shadow sm:p-8">
                <ViewProfileInformationForm
                  mustVerifyEmail={mustVerifyEmail}
                  status={status}
                  friends={friends}
                  className="max-w-xl"
                />
              </div>
            </div>
          </div>
          <div className="sticky bottom-[0]">
            <SidebarMini />
          </div>
        </>
      ) : (
        <>
          <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground sm:flex-row">
            <SidebarMini />
            <div className="order-3 hidden h-screen w-full flex-1 flex-col items-center justify-center gap-4 border-l border-secondary sm:flex">
              <ViewProfileInformationForm
                mustVerifyEmail={mustVerifyEmail}
                status={status}
                friends={friends}
                className="max-w-xl"
              />
            </div>
          </div>
        </>
      )}
    </AppProvider>
  );
}
