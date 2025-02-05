import { ChatProvider } from "@/contexts/chat-context";
import { ModalProvider } from "@/contexts/modal-context";

import AppLayout from "@/layouts/AppLayout";
import SidebarMini from "@/layouts/partials/SidebarMini";
import Sidebar from "@/components/chats/Sidebar";
import ContentEmpty from "@/components/chats/ContentEmpty";

export default function Chats() {
  return (
    <AppLayout title={route().current("chats.*") == true ? "채팅" : "거래제안"}>
      <ChatProvider>
        <ModalProvider>
          <SidebarMini />
          <Sidebar />
          <ContentEmpty />
        </ModalProvider>
      </ChatProvider>
    </AppLayout>
  );
}
