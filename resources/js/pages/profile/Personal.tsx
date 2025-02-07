import UpdateProfileInformationForm from "./partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import SidebarMini from "@/layouts/partials/SidebarMini";
import { AppProvider } from "@/contexts/app-context";
import { useScreenSize } from "@/hooks/use-screen-size";

export default function Personal({
  auth,
  mustVerifyEmail,
  status,
  friends,
}: PageProps<{ mustVerifyEmail: boolean; status?: string; friends: [] }>) {
  const { width } = useScreenSize();

  return (
    <AppProvider>
      <Head title="개인정보" />
      {width < 640 ? (
        <>
          <div className="min-h-[100vh] py-4 sm:py-6">
            <div className="mx-auto max-w-7xl space-y-4 px-4 sm:space-y-6 sm:px-6">
              <div className="bg-background  ">
                <UpdateProfileInformationForm
                  mustVerifyEmail={mustVerifyEmail}
                  status={status}
                  friends={friends}
                  className="max-w-xl"
                />
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
              <UpdateProfileInformationForm
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
