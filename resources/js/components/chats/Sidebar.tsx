import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import ChatListSearch from "@/components/chats/ChatListSearch";
import ChatList from "@/components/chats/ChatList";
import { useChatContext } from "@/contexts/chat-context";
import clsx from "clsx";
import { useModalContext } from "@/contexts/modal-context";
import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Link } from "@inertiajs/react";
import { usePremium } from "@/hooks/use-premium";
import Modal from "@/components/Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";

export default function Sidebar() {
  const { chats } = useChatContext();
  const { openModal } = useModalContext();
  const user = usePage<PageProps>().props.auth;
  const [search, setSearch] = useState("");

  const { currentPremium, remainedDays } = usePremium();

  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);

  const closeModal = () => {
    setConfirmingUserDeletion(false);
  };
  const addNewGroup = () => {
    if (!currentPremium) {
      setConfirmingUserDeletion(true);
      return;
    }
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
      <Modal show={confirmingUserDeletion} onClose={closeModal}>
        <div className="p-6">
          <header>
            <h2 className="text-lg font-medium text-foreground">
              정식회원으로 등록하시겠습니까?
            </h2>

            <p className="mt-1 text-sm text-secondary-foreground">
              고객님은 현재 임시회원입니다.
              <br />
              임시회원은 메시지전송, 메시지수신이 불가합니다. 정식회원으로
              등록하여 많은 파트너들을 만나보세요.
            </p>
          </header>

          <div className="mt-6 flex justify-end">
            <SecondaryButton onClick={closeModal}>취소</SecondaryButton>
            <div>
              <Link href={route("profile.premium")}>
                <PrimaryButton className="ms-3 bg-[#07c160]">
                  정식회원 등록
                </PrimaryButton>
              </Link>
            </div>
          </div>
        </div>
      </Modal>
      <div className="flex items-center justify-between px-2 pt-2 sm:pb-0">
        <h3 className="text-center text-lg">
          {route().current("business.*") == true ? (
            <>
              <b className="font-bold">{user.name}</b>님에게 적합한 거래제안
            </>
          ) : (
            "채팅"
          )}
        </h3>
        {route().current("business.*") == true ? (
          <button
            className="flex h-6 w-6 items-center justify-center bg-[#07c160] text-white"
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
