import { deleteMessage } from "@/api/chat-messages";
import Modal from "@/components/modals/Modal";
import { useChatContext } from "@/contexts/chat-context";
import { useChatMessageContext } from "@/contexts/chat-message-context";
import { useModalContext } from "@/contexts/modal-context";
import { ChatMessage } from "@/types/chat-message";
import { existingFiles, existingLinks, existingMedia } from "@/utils";
import { Fragment } from "react";

export default function DeleteMessageConfirmation() {
  const { closeModal, data: message } = useModalContext<ChatMessage>();
  const { refetchChats } = useChatContext();
  const { messages, setMessages, user, reloadMedia, reloadFiles, reloadLinks } =
    useChatMessageContext();

  if (!message) return;

  const handleDeleteMessage = () => {
    deleteMessage(message).then(() => {
      refetchChats();
      setMessages([...messages.filter((m) => m.id !== message.id)]);

      existingMedia(message.attachments) && reloadMedia(user);
      existingFiles(message.attachments) && reloadFiles(user);
      existingLinks(message.links) && reloadLinks(user);

      closeModal();
    });
  };

  return (
    <Modal>
      <Modal.Header title="삭제?" onClose={closeModal} />
      <Modal.Body as={Fragment}>
        <p>
          이 메시지는 당신에게서 제거됩니다. 채팅에 있는 다른 사람들은 여전히
          ​​그것을 볼 수 있습니다.
        </p>

        {message.attachments?.length > 0 && (
          <p>{message.attachments.length}개의 파일이 제거됩니다.</p>
        )}
      </Modal.Body>

      <Modal.Footer className="flex justify-between gap-4">
        <button className="btn btn-secondary flex-1" onClick={closeModal}>
          취소
        </button>
        <button className="btn btn-danger flex-1" onClick={handleDeleteMessage}>
          삭제
        </button>
      </Modal.Footer>
    </Modal>
  );
}
