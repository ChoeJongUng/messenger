import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import DeleteUserForm from "./partials/DeleteUserForm";
import PremiumForm from "./partials/PremiumForm";
import UpdatePasswordForm from "./partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import AppLayout from "@/layouts/AppLayout";
import SidebarMini from "@/layouts/partials/SidebarMini";
import Sidebar from "@/components/contacts/Sidebar";
import { AppProvider } from "@/contexts/app-context";
import { useScreenSize } from "@/hooks/use-screen-size";

export default function Premium({
  auth,
  mustVerifyEmail,
  status,
  friends,
}: PageProps<{ mustVerifyEmail: boolean; status?: string; friends: [] }>) {
  const { width } = useScreenSize();
  return (
    <AppProvider>
      <Head title="정식회원등록" />
      {width < 640 ? (
        <>
          <div className="min-h-[100vh] py-4 sm:py-6">
            <div className="mx-auto max-w-7xl space-y-4 px-4 sm:space-y-6 sm:px-6">
              <div className="rounded-md bg-background p-4 shadow sm:p-8">
                <div className="rounded-md bg-background p-4 shadow sm:p-8">
                  <PremiumForm className="max-w-xl" friends={friends} />
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
                <PremiumForm className="max-w-xl" friends={friends} />
              </div>
            </div>
          </div>
        </>
      )}
    </AppProvider>
  );
}
