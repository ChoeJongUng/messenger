import GuestLayout from "@/layouts/GuestLayout";
import PrimaryButton from "@/components/PrimaryButton";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function VerifyEmail({ status }: { status?: string }) {
  const { post, processing } = useForm({});

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("verification.send"));
  };

  return (
    <GuestLayout>
      <Head title="이메일 확인" />

      <div className="mb-4 text-sm text-foreground">
        가입해 주셔서 감사합니다! 시작하기 전에 방금 이메일로 보낸 링크를
        클릭하여 이메일 주소를 확인해 주시겠습니까? 이메일을 받지 못하셨다면
        기꺼이 다른 이메일을 보내드리겠습니다.
      </div>

      {status === "verification-link-sent" && (
        <div className="mb-4 text-sm font-medium text-green-600">
          등록 시 제공하신 이메일 주소로 새로운 확인 링크가 전송되었습니다.
        </div>
      )}

      <form onSubmit={submit}>
        <div className="mt-4 flex items-center justify-between">
          <PrimaryButton disabled={processing}>
            확인 이메일 재전송
          </PrimaryButton>

          <Link
            href={route("logout")}
            method="post"
            as="button"
            className="rounded-md text-sm text-foreground underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            로그아웃
          </Link>
        </div>
      </form>
    </GuestLayout>
  );
}
