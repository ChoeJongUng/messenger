import { deleteContact } from "@/api/contacts";
import Modal from "@/components/modals/Modal";
import { useContactContext } from "@/contexts/contact-context";
import { useModalContext } from "@/contexts/modal-context";
import { User } from "@/types/user";
import { Fragment } from "react";

export default function DeleteContactConfirmation() {
  const { closeModal, data: contact } = useModalContext<User>();
  const { contacts, setContacts } = useContactContext();

  if (!contact) return;

  const handleDeleteContact = () => {
    deleteContact(contact.id).then(() => {
      closeModal();
      setContacts([...contacts.filter((c) => c.id !== contact.id)]);
    });
  };

  return (
    <Modal>
      <Modal.Header title="연락처를 삭제하시겠습니까?" onClose={closeModal} />
      <Modal.Body as={Fragment}>
        <p>
          이 연락처는 귀하에게 삭제됩니다. 귀하의 연락처 목록에 나타나지
          않습니다.
        </p>
      </Modal.Body>

      <Modal.Footer className="flex justify-between gap-4">
        <button className="btn btn-secondary flex-1" onClick={closeModal}>
          취소
        </button>
        <button className="btn btn-danger flex-1" onClick={handleDeleteContact}>
          삭제
        </button>
      </Modal.Footer>
    </Modal>
  );
}
