import { exitGroup } from "@/api/groups";
import Modal from "@/components/modals/Modal";
import { useChatContext } from "@/contexts/chat-context";
import { useModalContext } from "@/contexts/modal-context";
import { Chat } from "@/types/chat";
import { Fragment } from "react";

export default function ExitGroupConfirmation() {
  const { closeModal, data: chat } = useModalContext<Chat>();
  const { chats, setChats } = useChatContext();

  const handleExitContact = () => {
    exitGroup(chat!).then(() => {
      setChats(chats.filter((c) => c.id !== chat?.id));
      closeModal();
    });
  };

  return (
    <Modal>
      <Modal.Header title={`"${chat?.name}" 그룹 종료?`} onClose={closeModal} />
      <Modal.Body as={Fragment}>
        <p>
          이 그룹은 귀하에게 제거됩니다. 이 그룹에서는 아무것도 볼 수 없습니다.
        </p>
      </Modal.Body>

      <Modal.Footer className="flex justify-between gap-4">
        <button className="btn btn-secondary flex-1" onClick={closeModal}>
          취소
        </button>
        <button className="btn btn-danger flex-1" onClick={handleExitContact}>
          그룹 종료
        </button>
      </Modal.Footer>
    </Modal>
  );
}
