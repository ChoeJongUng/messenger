import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import ChatListSearch from "@/components/chats/ChatListSearch";
import ChatList from "@/components/chats/ChatList";
import { useChatContext } from "@/contexts/chat-context";
import clsx from "clsx";
import { useModalContext } from "@/contexts/modal-context";

export default function Sidebar() {
  const { chats } = useChatContext();
  const { openModal } = useModalContext();

  const [search, setSearch] = useState("");

  const addNewGroup = () => {
    openModal({
      view: "ADD_NEW_GROUP",
      size: "lg",
    });
  };

  return (
    <div
      className={clsx(
        "order-1 flex-1 shrink-0 flex-col gap-2 sm:order-2 sm:flex sm:w-[320px] sm:flex-initial sm:border-l sm:border-secondary lg:w-[360px]",
        route().current("chats.show") ? "hidden" : "flex",
      )}
    >
      <div className="flex items-center justify-between px-2 pt-2 sm:pb-0">
        <h3 className="text-2xl font-semibold">
          {route().current("business.*") == true ? "거래제안" : "채팅"}
        </h3>
        {route().current("business.*") == true ? (
          <button
            className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-white"
            onClick={addNewGroup}
          >
            <FaPlusCircle />
          </button>
        ) : (
          <></>
        )}
      </div>

      {/* searching */}
      <ChatListSearch search={search} setSearch={setSearch} />

      {/* chats recently */}
      <ChatList search={search} href="chats.show" />

      {chats.length === 0 && search.length > 0 && (
        <p className="flex h-full flex-1 items-center justify-center">
          {route().current("business.*") == true
            ? "거래제안을 찾을수 없습니다."
            : "사용자를 찾을수 없습니다."}
        </p>
      )}

      {chats.length === 0 && search.length === 0 && (
        <p className="flex h-full flex-1 items-center justify-center">
          {route().current("business.*") == true
            ? "아직 거래제안이 없습니다."
            : "아직 채팅이 없습니다."}
        </p>
      )}
    </div>
  );
}
