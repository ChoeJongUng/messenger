import { deleteChat } from "@/api/chats";
import Modal from "@/components/modals/Modal";
import { useChatContext } from "@/contexts/chat-context";
import { useModalContext } from "@/contexts/modal-context";
import { Chat } from "@/types/chat";
import { router } from "@inertiajs/react";
import { Fragment } from "react";

export default function DeleteChatConfirmation() {
  const { closeModal, data: chat } = useModalContext<Chat>();
  const { chats, setChats } = useChatContext();

  if (!chat) return;

  const handleDeleteChat = () => {
    deleteChat(chat).then(() => {
      if (
        route().current("chats.index") ||
        route().current("archived_chats.index")
      ) {
        closeModal();
        setChats([...chats.filter((c) => c.id !== chat.id)]);

        return;
      }

      route().current("chats.*")
        ? router.replace(route("chats.index"))
        : router.replace(route("archived_chats.index"));
    });
  };

  return (
    <Modal>
      <Modal.Header title="채팅을 삭제하시겠습니까?" onClose={closeModal} />
      <Modal.Body as={Fragment}>
        <p>
          이 채팅은 파일을 포함하여 당신에게서 제거됩니다. 채팅에 있는 다른
          사람들은 여전히 ​​볼 수 있습니다.
        </p>
      </Modal.Body>

      <Modal.Footer className="flex justify-between gap-4">
        <button className="btn btn-secondary flex-1" onClick={closeModal}>
          취소
        </button>
        <button className="btn btn-danger flex-1" onClick={handleDeleteChat}>
          삭제
        </button>
      </Modal.Footer>
    </Modal>
  );
}
