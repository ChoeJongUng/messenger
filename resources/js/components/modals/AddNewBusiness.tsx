import Modal from "@/components/modals/Modal";
import { useModalContext } from "@/contexts/modal-context";
import { Chat } from "@/types/chat";
import { BusinessSchema } from "@/types/business";
import { router, useForm } from "@inertiajs/react";
import {
  ChangeEvent,
  FormEventHandler,
  Fragment,
  useEffect,
  useRef,
} from "react";
import { BsCamera } from "react-icons/bs";
import InputLabel from "@/components/InputLabel";
import TextInput from "@/components/TextInput";
import InputError from "@/components/InputError";
import TextArea from "@/components/TextArea";
import ComboBox from "@/components/ComboBox";
import { ChatMessagePageProps } from "@/types";

export default function AddNewBusiness() {
  const { closeModal } = useModalContext<Chat>();

  const { data, setData, post, errors, processing } = useForm<BusinessSchema>({
    _method: "POST",
    title: "",
    content: "",
  });

  const handleOnSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    if (processing) return;

    post(route("business.store"), {
      onSuccess: (response) => {
        router.get(route("business.index"));
        closeModal();
      },
    });
  };

  return (
    <form onSubmit={handleOnSubmit} className="space-y-4">
      <Modal>
        <Modal.Header title="새 거래제안" onClose={closeModal} />
        <Modal.Body as={Fragment}>
        
          <div className="space-y-2">
            <InputLabel htmlFor="title" value="주제" />

            <TextInput
              id="title"
              type="text"
              className="mt-1 block w-full"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
            />

            <InputError className="mt-2" message={errors.title} />
          </div>

          <div className="space-y-2">
            <InputLabel htmlFor="content" value="내용" />

            <TextArea
              id="content"
              className="mt-1 block w-full"
              value={data.content}
              onChange={(e) => setData("content", e.target.value)}
            />

            <InputError className="mt-2" message={errors.content} />
          </div>

         
        </Modal.Body>

        <Modal.Footer className="flex justify-between gap-4">
          <button className="btn btn-secondary flex-1" onClick={closeModal}>
            취소
          </button>
          <button className="btn btn-primary flex-1" disabled={processing}>
            저장
          </button>
        </Modal.Footer>
      </Modal>
    </form>
  );
}
