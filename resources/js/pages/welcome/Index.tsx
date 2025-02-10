import { useEffect, FormEventHandler } from "react";
import Checkbox from "@/components/Checkbox";
import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import PrimaryButton from "@/components/PrimaryButton";
import TextInput from "@/components/TextInput";
import { Link, useForm } from "@inertiajs/react";
import { LoginSchema } from "@/types/user";
import ApplicationLogo from "@/components/ApplicationLogo";
import moment from "moment";
import { BsHeartFill } from "react-icons/bs";

export default function Welcome({
  canResetPassword,
  appName,
}: {
  canResetPassword: boolean;
  appName: string;
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
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 p-6 font-['Inter'] text-foreground sm:gap-12 sm:p-8">
      <div>
        <Link href="/">
          <ApplicationLogo className="h-10 w-10" />
        </Link>
      </div>

      <div className="my-auto grid grid-cols-1 sm:grid-cols-2">
        <div className="space-y-8 sm:w-11/12 sm:space-y-12">
          {/* <h1 className="text-4xl font-bold sm:text-5xl lg:text-7xl">
            <span className="bg-gradient-to-r from-blue-300 via-purple-500 to-rose-500 bg-clip-text text-transparent">
              새로운 기회가
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-rose-500 bg-clip-text text-transparent">
              열리는 ,
            </span>
            <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-rose-500 bg-clip-text text-transparent">
              {" 창의적이고 혁신적인 공간."}
            </span>
          </h1> */}

          <p className="text-lg sm:text-xl">
            원하는 비지니스 파트너를 어서 만나보세요.
          </p>

          <form onSubmit={submit} className="flex flex-col gap-4 lg:w-3/4">
            <div>
              <TextInput
                id="phone"
                type="phone"
                name="phone"
                value={data.phone}
                className="w-full border-secondary bg-secondary dark:border-secondary"
                autoComplete="username"
                isFocused={true}
                onChange={(e) => setData("phone", e.target.value)}
                placeholder="전화번호"
              />

              <InputError message={errors.phone} className="mt-2" />
            </div>

            <div>
              <TextInput
                id="password"
                type="password"
                name="password"
                value={data.password}
                className="w-full border-secondary bg-secondary dark:border-secondary"
                autoComplete="current-password"
                onChange={(e) => setData("password", e.target.value)}
                placeholder="비밀번호"
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

            <div className="mt-4 flex">
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
        </div>
      </div>

      <div className="mt-auto flex gap-2">
        <Link className="font-medium" href="/">
          &copy; {appName} {moment().format("Y")}.
        </Link>
        <span className="flex items-center gap-1 text-secondary-foreground">
          <BsHeartFill className="text-sm text-danger" /> By TradeLink{" "}
        </span>
      </div>
    </div>
  );
}
