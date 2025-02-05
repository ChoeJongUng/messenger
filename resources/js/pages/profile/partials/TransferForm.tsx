import { useRef, useState, FormEventHandler, useEffect } from "react";
import DangerButton from "@/components/DangerButton";
import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import Modal from "@/components/Modal";
import SecondaryButton from "@/components/SecondaryButton";
import TextInput from "@/components/TextInput";
import { usePage, useForm } from "@inertiajs/react";
import { PageProps } from "@/types";
import Dropdown from "@/components/Dropdown";

export default function TransferForm({
  className = "",
  friends,
}: {
  className?: string;
  friends: any;
}) {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const user = usePage<PageProps>().props.auth;
  const { data, setData, post, processing, reset, errors } = useForm({
    balance: user.balance,
    amount: 0,
    target_id: "",
    target_name: "",
  });
  const [etarget, setEtarget] = useState(false);
  const [ebalance, setEbalance] = useState(false);
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
    if (data.target_name == "") {
      setEtarget(true);
      closeModal();
      return;
    }
    if (data.amount < 1) {
      setEamount(true);
      closeModal();

      return;
    }
    if (data.amount > user.balance) {
      setEbalance(true);
      closeModal();

      return;
    }
    post(route("profile.transfer"), {
      onSuccess: () => closeModal(),
      onFinish: () => reset(),
    });
  };
  return (
    <section className={`space-y-6 ${className}`}>
      <header>
        <h2 className="text-lg font-medium text-foreground">계좌이채</h2>
      </header>
      <form onSubmit={transferBalance}>
        <div className="mt-6">
          <InputLabel htmlFor="balance" value="보유금액" />

          <TextInput
            id="balance"
            type="number"
            name="balance"
            value={data.balance}
            onChange={(e) => setData("balance", parseInt(e.target.value))}
            className="mt-1 block w-full sm:w-3/4"
            isFocused
            placeholder="0"
            readOnly
          />
          {ebalance && (
            <p className="text-[12px] text-[red]">
              보유금액이 충분하지 않습니다.
            </p>
          )}

          <InputError message={errors.balance} className="mt-2" />
        </div>
        <div className="mt-6">
          <InputLabel
            htmlFor="target"
            value="받을 사람"
            // className="sr-only액"
          />

          <Dropdown>
            <Dropdown.Trigger>
              <button
                className="btn btn-secondary flex w-full items-center gap-2 sm:w-3/4"
                onClick={(e) => e.preventDefault()}
              >
                {data.target_name || "받을 사람"}
              </button>
            </Dropdown.Trigger>
            <Dropdown.Content>
              {friends.map((friend: { id: string; name: string }) => (
                <Dropdown.Button
                  onClick={(e) => {
                    e.preventDefault();
                    setData("target_id", friend.id);
                    setData("target_name", friend.name);
                    setEtarget(false);
                  }}
                >
                  {friend.name}
                </Dropdown.Button>
              ))}
            </Dropdown.Content>
          </Dropdown>
          {etarget && (
            <p className="text-[12px] text-[red]">받을사람을 선택하십시오.</p>
          )}
          <InputError message={errors.target_id} className="mt-2" />
        </div>
        <div className="mt-6">
          <InputLabel
            htmlFor="amount"
            value="이채금액"
            // className="sr-only액"
          />

          <TextInput
            id="amount"
            type="number"
            name="amount"
            value={data.amount}
            onChange={(e) => {
              setData("amount", parseInt(e.target.value));
              setEamount(false);
              setEbalance(false);
            }}
            className="mt-1 block w-full sm:w-3/4"
            placeholder="amount"
          />

          {eamount && (
            <p className="text-[12px] text-[red]">
              이채금액을 정확히 입력하십시오.
            </p>
          )}
          <InputError message={errors.amount} className="mt-2" />
        </div>
      </form>
      <DangerButton
        onClick={confirmUserDeletion}
        className="w-full bg-[#07c160]"
      >
        이채
      </DangerButton>

      <Modal show={confirmingUserDeletion} onClose={closeModal}>
        <div className="p-6">
          <header>
            <h2 className="text-lg font-medium text-foreground">확인</h2>

            <p className="mt-1 text-sm text-secondary-foreground">
              정말 계좌이채를 진행하시렵니까?
            </p>
          </header>

          <div className="mt-6 flex justify-end">
            <SecondaryButton onClick={closeModal}>취소</SecondaryButton>

            <DangerButton
              className="ms-3"
              disabled={processing}
              onClick={transfer}
            >
              이채
            </DangerButton>
          </div>
        </div>
      </Modal>
    </section>
  );
}
