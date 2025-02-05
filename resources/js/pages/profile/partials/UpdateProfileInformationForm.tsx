import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import PrimaryButton from "@/components/PrimaryButton";
import TextInput from "@/components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { ChangeEvent, FormEventHandler, useRef } from "react";
import { PageProps } from "@/types";
import { BsCamera } from "react-icons/bs";
import { UpdateProfileSchema } from "@/types/user";

export default function UpdateProfileInformation({
  mustVerifyEmail,
  status,
  className = "",
}: {
  mustVerifyEmail: boolean;
  status?: string;
  className?: string;
}) {
  const user = usePage<PageProps>().props.auth;
  const avatarRef = useRef<HTMLImageElement>(null);

  const { data, setData, post, errors, processing, recentlySuccessful } =
    useForm<UpdateProfileSchema>({
      _method: "PATCH",
      name: user.name,
      phone: user.phone,
      avatar: null,
      gender: user.gender,
      age: user.age,
      country: user.country,
      city: user.city,
      company: user.company,
      job: user.job,
      category: user.category,
      capability: user.capability,
    });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("profile.update"));
  };

  const changeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setData("avatar", files[0]);

      const imageUrl = window.URL.createObjectURL(files[0]);
      avatarRef.current?.setAttribute("src", imageUrl);

      return () => {
        window.URL.revokeObjectURL(imageUrl);
      };
    }
  };

  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-foreground">개인정보</h2>

        <p className="mt-1 text-sm text-secondary-foreground">
          귀하의 개인정보를 업데이트하십시오.
        </p>
      </header>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <div className="picture relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="mx-auto h-20 w-20 rounded-full border border-secondary"
            ref={avatarRef}
          />

          <label
            htmlFor="avatar"
            className="btn btn-primary absolute left-1/2 top-6 flex translate-x-5 cursor-pointer items-center justify-center rounded-full px-2"
            tabIndex={0}
          >
            <BsCamera />
            <input
              type="file"
              onChange={changeAvatar}
              id="avatar"
              className="hidden"
            />
          </label>
        </div>

        <div>
          <InputLabel htmlFor="name" value="이름" />

          <TextInput
            id="name"
            className="mt-1 block w-full"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            required
            isFocused
            autoComplete="name"
          />

          <InputError className="mt-2" message={errors.name} />
        </div>

        <div>
          <InputLabel htmlFor="phone" value="전화번호" />

          <TextInput
            id="phone"
            type="phone"
            className="mt-1 block w-full"
            value={data.phone}
            onChange={(e) => setData("phone", e.target.value)}
            required
            autoComplete="username"
          />

          <InputError className="mt-2" message={errors.phone} />
        </div>

        {/* {mustVerifyEmail && user.phone_verified_at === null && (
          <div>
            <p className="mt-2 text-sm text-foreground">
              귀하의 이메일 주소가 검증되지 않았습니다.
              <Link
                href={route("verification.send")}
                method="post"
                as="button"
                className="btn btn-secondary"
              >
                여기를 클릭하여 확인 이메일을 다시 보내세요.
              </Link>
            </p>

            {status === "verification-link-sent" && (
              <div className="mt-2 text-sm font-medium text-success">
                귀하의 이메일 주소로 새로운 확인 링크가 전송되었습니다.
              </div>
            )}
          </div>
        )} */}

        <div className="flex items-center gap-4">
          <PrimaryButton disabled={processing}>저장</PrimaryButton>

          <Transition
            show={recentlySuccessful}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
          >
            <p className="text-sm text-foreground">저장됨.</p>
          </Transition>
        </div>
      </form>
    </section>
  );
}
