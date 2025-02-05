import { useEffect, FormEventHandler } from "react";
import GuestLayout from "@/layouts/GuestLayout";
import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import PrimaryButton from "@/components/PrimaryButton";
import TextInput from "@/components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { RegisterUserSchema } from "@/types/user";

export default function Register() {
  const { data, setData, post, processing, errors, reset } =
    useForm<RegisterUserSchema>({
      name: "",
      phone: "",
      password: "",
      password_confirmation: "",
    });

  useEffect(() => {
    return () => {
      reset("password", "password_confirmation");
    };
  }, []);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("register"));
  };

  return (
    <GuestLayout>
      <Head title="등록" />

      <form onSubmit={submit} className="space-y-4">
        <div>
          <InputLabel htmlFor="name" value="이름" />

          <TextInput
            id="name"
            name="name"
            value={data.name}
            className="mt-1 block w-full"
            autoComplete="name"
            isFocused={true}
            onChange={(e) => setData("name", e.target.value)}
          />

          <InputError message={errors.name} className="mt-2" />
        </div>

        <div>
          <InputLabel htmlFor="phone" value="전화번호" />

          <TextInput
            id="phone"
            type="text"
            name="phone"
            value={data.phone}
            className="mt-1 block w-full"
            autoComplete="username"
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
            autoComplete="new-password"
            onChange={(e) => setData("password", e.target.value)}
          />

          <InputError message={errors.password} className="mt-2" />
        </div>

        <div>
          <InputLabel htmlFor="password_confirmation" value="비밀번호 확인" />

          <TextInput
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            className="mt-1 block w-full"
            autoComplete="new-password"
            onChange={(e) => setData("password_confirmation", e.target.value)}
          />

          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        <div className="flex items-center">
          <PrimaryButton className="w-full" disabled={processing}>
            등록
          </PrimaryButton>
        </div>

        <div className="flex justify-center">
          <Link href={route("login")} className="btn-link">
            이미 등록하셨나요?
          </Link>
        </div>
      </form>
    </GuestLayout>
  );
}
