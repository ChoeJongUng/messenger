import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import DeleteUserForm from "./partials/DeleteUserForm";
import TransferForm from "./partials/TransferForm";
import UpdatePasswordForm from "./partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import AppLayout from "@/layouts/AppLayout";
import SidebarMini from "@/layouts/partials/SidebarMini";
import Sidebar from "@/components/contacts/Sidebar";
import { AppProvider } from "@/contexts/app-context";

export default function Charge({
  auth,
  mustVerifyEmail,
  status,
  friends
}: PageProps<{ mustVerifyEmail: boolean; status?: string ;friends:[];}>) {
  return (
    <AppProvider>
      <Head
        title="계좌충전"
      />
      <div className="py-4 sm:py-6">
        <div className="mx-auto max-w-7xl space-y-4 px-4 sm:space-y-6 sm:px-6">
          {/* <div className="rounded-lg bg-background p-4 shadow sm:p-8">
            <TransferForm className="max-w-xl" friends={friends}/>
          </div> */}
          <div className="rounded-lg bg-background p-4 shadow sm:p-8">
            <UpdateProfileInformationForm
              mustVerifyEmail={mustVerifyEmail}
              status={status}
              friends={friends}
              className="max-w-xl"
            />
          </div>

          <div className="rounded-lg bg-background p-4 shadow sm:p-8">
            <UpdatePasswordForm className="max-w-xl" />
          </div>

          <div className="rounded-lg bg-background p-4 shadow sm:p-8">
            <DeleteUserForm className="max-w-xl" />
          </div>
        </div>
      </div>
      <div className="sticky bottom-[0]">
        <SidebarMini />
      </div>
    
    </AppProvider>
  );
}
