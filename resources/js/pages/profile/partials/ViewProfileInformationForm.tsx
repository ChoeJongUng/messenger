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
export default function ViewProfileInformation({
  mustVerifyEmail,
  status,
  friends,
  className = "",
}: {
  mustVerifyEmail: boolean;
  status?: string;
  friends:any;
  className?: string;
}) {
  
  const user = usePage<PageProps>().props.auth;
  const avatarRef = useRef<HTMLImageElement>(null);
  const { currentPremium,remainedDays } = usePremium();

  const jobs=["사장","기사"];
  const categories = ["운송","무역"];
  const capabilities = ["100","200"];
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
        <div className="picture relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="mx-auto h-20 w-20 rounded-full border border-secondary"
            ref={avatarRef}
          />
          <p className="mx-auto mt-2 text-center">{user.name}</p>
        </div>
        <div className="inline space-between">
          <p className="inline">계정잔액: ${user.balance}</p>
          <p className="inline float-right">
            {currentPremium==true?"정식회원:"+remainedDays+"일":"임시회원"}
          </p>
        </div>
        <Link href={route("profile.premium")}>
          <PrimaryButton className=" w-full !bg-[forestgreen] !mt-1 !rounded-[0]">
            정식회원등록
          </PrimaryButton>
        </Link>
        <Link href={route("profile.personal")}>
          <PrimaryButton className=" w-full !bg-[forestgreen] !mt-1 !rounded-[0]">
            개인정보
          </PrimaryButton>
        </Link>
        <Link href={route("profile.security")}>
        
          <PrimaryButton className=" w-full !bg-[forestgreen] !mt-1 !rounded-[0]">
            보안설정
          </PrimaryButton>
        </Link>
        <Link href={route("profile.account")}>

          <PrimaryButton className=" w-full !bg-[forestgreen] !mt-1 !rounded-[0] ">
            계정설정
          </PrimaryButton>
        </Link>
        <Link href={route("profile.charge")}>
          <PrimaryButton className=" w-full !bg-[forestgreen] !mt-1 !rounded-[0] ">
            계좌충전
          </PrimaryButton>
        </Link>
        <Link href={route("profile.btransfer")}>
        
          <PrimaryButton className=" w-full !bg-[forestgreen] !mt-1 !rounded-[0] ">
            계좌이채
          </PrimaryButton>
        </Link>
      </form>
    </section>
  );
}
