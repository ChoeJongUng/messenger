import GuestLayout from "@/layouts/GuestLayout";
import InputError from "@/components/InputError";
import PrimaryButton from "@/components/PrimaryButton";
import TextInput from "@/components/TextInput";
import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import FormAlert from "@/components/FormAlert";

export default function ForgotPassword({ status }: { status?: string }) {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("password.email"));
  };

  return (
    <GuestLayout>
      <Head title="비밀번호를 잊으셨나요?" />

      <div className="mb-4 text-sm text-foreground">
        비밀번호를 잊으셨나요? 문제 없습니다. 이메일 주소만 알려주시면 비밀번호
        재설정 링크를 이메일로 보내드립니다. 이를 통해 새 비밀번호를 선택할 수
        있습니다.
      </div>

      {status && <FormAlert message={status} />}

      <form onSubmit={submit}>
        <TextInput
          id="email"
          type="email"
          name="email"
          value={data.email}
          className="mt-1 block w-full"
          isFocused={true}
          onChange={(e) => setData("email", e.target.value)}
        />

        <InputError message={errors.email} className="mt-2" />

        <div className="mt-4 flex">
          <PrimaryButton className="w-full" disabled={processing}>
            이메일 비밀번호 재설정 링크
          </PrimaryButton>
        </div>
      </form>
    </GuestLayout>
  );
}
