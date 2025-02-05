import { useRef, useState, FormEventHandler } from "react";
import DangerButton from "@/components/DangerButton";
import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import Modal from "@/components/Modal";
import SecondaryButton from "@/components/SecondaryButton";
import TextInput from "@/components/TextInput";
import { useForm } from "@inertiajs/react";

export default function DeleteUserForm({
  className = "",
}: {
  className?: string;
}) {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const passwordInput = useRef<HTMLInputElement>(null);

  const {
    data,
    setData,
    delete: destroy,
    processing,
    reset,
    errors,
  } = useForm({
    password: "",
  });

  const confirmUserDeletion = () => {
    setConfirmingUserDeletion(true);
  };

  const deleteUser: FormEventHandler = (e) => {
    e.preventDefault();

    destroy(route("profile.destroy"), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => passwordInput.current?.focus(),
      onFinish: () => reset(),
    });
  };

  const closeModal = () => {
    setConfirmingUserDeletion(false);

    reset();
  };

  return (
    <section className={`space-y-6 ${className}`}>
      <header>
        <h2 className="text-lg font-medium text-foreground">계정 삭제</h2>

        <p className="mt-1 text-sm text-secondary-foreground">
          계정이 삭제되면 모든 리소스와 데이터가 영구적으로 삭제됩니다. 계정을
          삭제하기 전에 보관하려는 모든 데이터나 정보를 다운로드하세요.
        </p>
      </header>

      <DangerButton onClick={confirmUserDeletion}>계정 삭제</DangerButton>

      <Modal show={confirmingUserDeletion} onClose={closeModal}>
        <form onSubmit={deleteUser} className="p-6">
          <h2 className="text-lg font-medium text-foreground">
            계정을 삭제하시겠습니까?
          </h2>

          <p className="mt-1 text-sm text-secondary-foreground">
            계정이 삭제되면 모든 리소스와 데이터가 영구적으로 삭제됩니다.
            영구적으로 계정을 삭제하고 싶다는 것을 확인하려면 비밀번호를
            입력하세요.
          </p>

          <div className="mt-6">
            <InputLabel
              htmlFor="password"
              value="비밀번호"
              className="sr-only"
            />

            <TextInput
              id="password"
              type="password"
              name="password"
              ref={passwordInput}
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              className="mt-1 block w-full sm:w-3/4"
              isFocused
              placeholder="Password"
            />

            <InputError message={errors.password} className="mt-2" />
          </div>

          <div className="mt-6 flex justify-end">
            <SecondaryButton onClick={closeModal}>취소</SecondaryButton>

            <DangerButton className="ms-3" disabled={processing}>
              계정 삭제
            </DangerButton>
          </div>
        </form>
      </Modal>
    </section>
  );
}
