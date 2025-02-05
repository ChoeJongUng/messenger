import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import PrimaryButton from "@/components/PrimaryButton";
import DangerButton from "@/components/DangerButton";

import TextInput from "@/components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { ChangeEvent, FormEventHandler, useRef } from "react";
import { PageProps } from "@/types";
import { BsCamera } from "react-icons/bs";
import { UpdateProfileSchema } from "@/types/user";
import Dropdown from "@/components/Dropdown";
import { usePremium } from "@/hooks/use-premium";
import {
  UserCircleIcon,
  ChevronRightIcon,
  LockClosedIcon,
  CurrencyDollarIcon,
  ArrowsRightLeftIcon,
  WrenchIcon,
  KeyIcon,
} from "@heroicons/react/24/outline"; // Import icons

export default function ViewProfileInformation({
  mustVerifyEmail,
  status,
  friends,
  className = "",
}: {
  mustVerifyEmail: boolean;
  status?: string;
  friends: any;
  className?: string;
}) {
  const user = usePage<PageProps>().props.auth;
  const avatarRef = useRef<HTMLImageElement>(null);
  const { currentPremium, remainedDays } = usePremium();

  const jobs = ["사장", "기사"];
  const categories = ["운송", "무역"];
  const capabilities = ["100", "200"];
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
      <form onSubmit={submit} className="mt-6 space-y-6">
        <div className="rounded-md p-4 shadow">
          <div className="picture relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="mx-auto h-20 w-20 rounded-md border border-secondary"
              ref={avatarRef}
            />
            <p className="mx-auto mt-2 text-center text-lg">
              <b>{user.name}</b>
            </p>
          </div>
          <div className="space-between inline">
            <p className="inline text-sm">보유금액: ${user.balance}</p>
            <p className="float-right inline text-sm">
              {currentPremium == true
                ? "정식회원:" + remainedDays + "일"
                : "임시회원"}
            </p>
          </div>
        </div>
        <div className="rounded-md shadow">
          <Link href={route("profile.personal")}>
            <PrimaryButton className="!mt-1 flex w-full items-center !rounded-[0] !bg-[#07c160] text-left">
              <UserCircleIcon className="inline h-6 w-6" />
              <span className="text-lg">&nbsp;{" 개인정보"}</span>
              <ChevronRightIcon className="ml-auto inline h-4 w-4" />
            </PrimaryButton>
          </Link>
          <Link href={route("profile.security")}>
            <PrimaryButton className="!mt-1 flex w-full items-center !rounded-[0] !bg-[#07c160] text-left">
              <LockClosedIcon className="inline h-6 w-6" />
              <span className="text-lg">&nbsp;{" 보안설정"}</span>
              <ChevronRightIcon className="ml-auto inline h-4 w-4" />
            </PrimaryButton>
          </Link>
          <Link href={route("profile.charge")}>
            <PrimaryButton className="!mt-1 flex w-full items-center !rounded-[0] !bg-[#07c160] text-left">
              <CurrencyDollarIcon className="inline h-6 w-6" />
              <span className="text-lg">&nbsp;{" 계좌충전"}</span>
              <ChevronRightIcon className="ml-auto inline h-4 w-4" />
            </PrimaryButton>
          </Link>
          <Link href={route("profile.btransfer")}>
            <PrimaryButton className="!mt-1 flex w-full items-center !rounded-[0] !bg-[#07c160] text-left">
              <ArrowsRightLeftIcon className="inline h-6 w-6" />
              <span className="text-lg">&nbsp;{" 계좌이채"}</span>
              <ChevronRightIcon className="ml-auto inline h-4 w-4" />
            </PrimaryButton>
          </Link>
          <Link href={route("profile.account")}>
            <PrimaryButton className="!mt-1 flex w-full items-center !rounded-[0] !bg-[#07c160] text-left">
              <WrenchIcon className="inline h-6 w-6" />
              <span className="text-lg">&nbsp;{" 계정설정"}</span>
              <ChevronRightIcon className="ml-auto inline h-4 w-4" />
            </PrimaryButton>
          </Link>
          <Link href={route("profile.premium")}>
            <PrimaryButton className="!mt-1 flex w-full items-center !rounded-[0] !bg-[#07c160] text-left">
              <KeyIcon className="inline h-6 w-6" />
              <span className="text-lg">&nbsp;{" 정식회원등록"}</span>
              <ChevronRightIcon className="ml-auto inline h-4 w-4" />
            </PrimaryButton>
          </Link>
        </div>
      </form>
    </section>
  );
}
