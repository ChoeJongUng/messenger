import { useEffect, FormEventHandler } from "react";
import Checkbox from "@/components/Checkbox";
import GuestLayout from "@/layouts/GuestLayout";
import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import PrimaryButton from "@/components/PrimaryButton";
import TextInput from "@/components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import FormAlert from "@/components/FormAlert";
import { LoginSchema } from "@/types/user";

export default function Login({
  status,
  canResetPassword,
}: {
  status?: string;
  canResetPassword: boolean;
}) {
  const { data, setData, post, processing, errors, reset } =
    useForm<LoginSchema>({
      phone: "",
      password: "",
      remember: false,
    });

  useEffect(() => {
    return () => {
      reset("password");
    };
  }, []);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("login"));
  };

  return (
    <GuestLayout>
      <Head title="로그인" />

      {status && <FormAlert message={status} />}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <InputLabel htmlFor="phone" value="전화번호" />

          <TextInput
            id="phone"
            type="phone"
            name="phone"
            value={data.phone}
            className="mt-1 block w-full"
            autoComplete="username"
            isFocused={true}
            onChange={(e) => setData("phone", e.target.value)}
          />

          <InputError message={errors.phone} className="mt-2" />
        </div>

        <div>
          <InputLabel htmlFor="password" value="비밀번호" />

          <TextInput
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full"
            autoComplete="current-password"
            onChange={(e) => setData("password", e.target.value)}
          />

          <InputError message={errors.password} className="mt-2" />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <Checkbox
              name="remember"
              checked={data.remember}
              onChange={(e) => setData("remember", e.target.checked)}
            />
            <span className="ms-2 text-sm text-foreground">기억하기</span>
          </label>

          {canResetPassword && (
            <Link href={route("password.request")} className="btn-link">
              비밀번호를 잊으셨나요?
            </Link>
          )}
        </div>

        <div className="flex">
          <PrimaryButton className="w-full" disabled={processing}>
            로그인
          </PrimaryButton>
        </div>

        <div className="flex justify-center">
          <Link href={route("register")} className="btn-link">
            계정이 없으신가요?
          </Link>
        </div>
      </form>
    </GuestLayout>
  );
}
