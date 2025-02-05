import AppLayout from "@/layouts/AppLayout";
import SidebarMini from "@/layouts/partials/SidebarMini";
import ContentEmpty from "@/components/chats/ContentEmpty";
import Content from "@/components/preferences/Content";

export default function Preferences() {
  return (
    <AppLayout title="설정">
      <SidebarMini />
      <Content />
      <ContentEmpty />
    </AppLayout>
  );
}
