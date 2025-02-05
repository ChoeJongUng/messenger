import { blockContact } from "@/api/contacts";
import Modal from "@/components/modals/Modal";
import { useChatContext } from "@/contexts/chat-context";
import { useChatMessageContext } from "@/contexts/chat-message-context";
import { useContactContext } from "@/contexts/contact-context";
import { useModalContext } from "@/contexts/modal-context";
import { Chat } from "@/types/chat";
import { Fragment } from "react";

export default function BlockContactConfirmation() {
  const { closeModal, data: chat } = useModalContext<Chat>();
  const { chats, setChats } = useChatContext();
  const { contacts, setContacts } = useContactContext();
  const { user, setUser } = useChatMessageContext();

  if (!chat) return;

  const handleblockContact = () => {
    blockContact(chat.id).then(() => {
      if (route().current("chats.*") || route().current("archived_chats.*")) {
        setChats(
          chats.map((c) => {
            if (c.id === chat.id) {
              c.is_contact_blocked = true;
            }

            return c;
          }),
        );

        if (user?.id === chat.id) {
          setUser({ ...user, is_contact_blocked: true });
        }
      } else {
        setContacts(
          contacts.map((c) => {
            if (c.id === chat.id) {
              c.is_contact_blocked = true;
            }

            return c;
          }),
        );
      }

      closeModal();
    });
  };

  return (
    <Modal>
      <Modal.Header title="차단?" onClose={closeModal} />
      <Modal.Body as={Fragment}>
        <p>
          이 연락처는 연락처에서 제거됩니다. 블록을 다시 열면 연락처를 저장할 수
          있습니다.
        </p>
      </Modal.Body>

      <Modal.Footer className="flex justify-between gap-4">
        <button className="btn btn-secondary flex-1" onClick={closeModal}>
          취소
        </button>
        <button className="btn btn-danger flex-1" onClick={handleblockContact}>
          차단
        </button>
      </Modal.Footer>
    </Modal>
  );
}
