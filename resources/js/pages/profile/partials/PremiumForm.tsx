import { useRef, useState, FormEventHandler, useEffect } from "react";
import DangerButton from "@/components/DangerButton";
import Modal from "@/components/Modal";
import SecondaryButton from "@/components/SecondaryButton";
import { usePage, useForm, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import { usePremium } from "@/hooks/use-premium";
import PrimaryButton from "@/components/PrimaryButton";
export default function PremiumForm({
  className = "",
  friends,
}: {
  className?: string;
  friends: any;
}) {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const user = usePage<PageProps>().props.auth;
  const { currentPremium, remainedDays } = usePremium();
  const { data, setData, post, processing, reset, errors } = useForm({
    balance: user.balance,
    amount: 0,
    target_id: "",
    target_name: "",
  });
  const [etarget, setEtarget] = useState(false);
  const [ebalance, setEbalance] = useState(false);
  const [eprofile, setEprofile] = useState(false);
  const [eamount, setEamount] = useState(false);
  const confirmUserDeletion = () => {
    setConfirmingUserDeletion(true);
  };
  const transferBalance: FormEventHandler = (e) => {
    e.preventDefault();
  };

  const closeModal = () => {
    setConfirmingUserDeletion(false);
    reset();
  };
  const transfer = () => {
    if (user.balance < 1000) {
      setEbalance(true);
      closeModal();
      return;
    }
    if (!user.gender || !user.age || !user.country) {
      setEprofile(true);
      closeModal();
      return;
    }
    post(route("profile.purchase"), {
      onSuccess: () => closeModal(),
      onFinish: () => reset(),
    });
  };
  return (
    <section className={`space-y-6 ${className}`}>
      <header>
        <h2 className="text-lg font-medium text-foreground">정식회원등록</h2>
      </header>
      <form onSubmit={transferBalance}>
        <p>
          현재상태:{" "}
          {currentPremium == true
            ? "정식회원, " + remainedDays + "일"
            : "임시회원"}
        </p>
        <p>보유금액: ${data.balance}</p>
        {eprofile && (
          <>
            <p className="text-[12px] text-[red]">
              정식회원등록을 하시려면 개인정보를 모두 입력하여야 합니다.
            </p>
            <Link href={route("profile.personal")}>
              <PrimaryButton className="w-full bg-[#07c160]">
                개인정보
              </PrimaryButton>
            </Link>
          </>
        )}
        {ebalance && (
          <>
            <p className="text-[12px] text-[red]">
              보유금액이 충분하지 않습니다. 한달 정식회원비는 $1000입니다.
            </p>
            <Link href={route("profile.charge")}>
              <DangerButton className="w-full bg-[#07c160]">
                계좌충전
              </DangerButton>
            </Link>
          </>
        )}
      </form>
      <DangerButton
        onClick={confirmUserDeletion}
        className="w-full bg-[#07c160]"
      >
        등록
      </DangerButton>

      <Modal show={confirmingUserDeletion} onClose={closeModal}>
        <div className="p-6">
          <header>
            <h2 className="text-lg font-medium text-foreground">확인</h2>

            <p className="mt-1 text-sm text-secondary-foreground">
              {currentPremium == true
                ? "정식회원기일을 365일 연장하시겠습니까?"
                : "정식회원으로 등록하시겠습니까?"}
            </p>
          </header>

          <div className="mt-6 flex justify-end">
            <SecondaryButton onClick={closeModal}>취소</SecondaryButton>

            <DangerButton
              className="ms-3"
              disabled={processing}
              onClick={transfer}
            >
              등록
            </DangerButton>
          </div>
        </div>
      </Modal>
    </section>
  );
}
