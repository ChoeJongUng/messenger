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
import { useScreenSize } from "@/hooks/use-screen-size";
import { Link } from "@inertiajs/react";
import { BsBoxArrowRight } from "react-icons/bs";
import { BsChevronRight } from "react-icons/bs";
import PrimaryButton from "@/components/PrimaryButton";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
export default function Account({
  auth,
  mustVerifyEmail,
  status,
  friends,
}: PageProps<{ mustVerifyEmail: boolean; status?: string; friends: [] }>) {
  const { width } = useScreenSize();

  return (
    <AppProvider>
      <Head title="계정설정" />
      {width < 640 ? (
        <>
          <div className="min-h-[100vh] py-4 sm:py-6">
            <div className="mx-auto max-w-7xl space-y-4 px-4 sm:space-y-6 sm:px-6">
              <div className="rounded-md bg-background p-4 shadow sm:p-8">
                <DeleteUserForm className="max-w-xl" />
              </div>
              <Link
                href={route("logout")}
                as="button"
                method="post"
                className="btn btn-secondary flex w-full items-center "
              >
                <PrimaryButton className="!mt-1 flex w-full items-center !rounded-md !bg-[#07c160] text-left">
                  <BsBoxArrowRight className="inline h-6 w-6" />
                  <span className="text-md">&nbsp;{" 로그아웃"}</span>
                  <ChevronRightIcon className="ml-auto inline h-4 w-4" />
                </PrimaryButton>
              </Link>
            </div>
          </div>
          <div className="fixed bottom-[0]">
            <SidebarMini />
          </div>
        </>
      ) : (
        <>
          <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground sm:flex-row">
            <SidebarMini />
            <div className="order-3 hidden h-screen w-full flex-1 flex-col items-center justify-center gap-4 border-l border-secondary sm:flex">
              <DeleteUserForm className="max-w-xl" />
            </div>
          </div>
        </>
      )}
    </AppProvider>
  );
}
