import BadgeNotification from "@/components/chats/BadgeNotification";
import Dropdown from "@/components/Dropdown";
import { useAppContext } from "@/contexts/app-context";
import { useModalContext } from "@/contexts/modal-context";
import { useScreenSize } from "@/hooks/use-screen-size";
import { Link } from "@inertiajs/react";
import clsx from "clsx";
import {
  BsArchive,
  BsBoxArrowRight,
  BsChat,
  BsGear,
  BsPeople,
  BsPersonCircle,
  BsBank,
  BsStack,
} from "react-icons/bs";

export default function SidebarMini() {
  const { auth, notificationCount } = useAppContext();
  const { openModal } = useModalContext();
  const { width } = useScreenSize();

  const openPreferences = () => {
    openModal({ view: "PREFERENCES", size: "lg" });
  };

  return (
    <div
      className={clsx(
        "order-2 mt-auto flex-row justify-between bg-background sm:order-1 sm:mt-0 sm:flex sm:flex-col sm:items-center sm:justify-center sm:p-2",
        route().current("chats.show") ? "hidden" : "flex",
      )}
    >
      <Link
        href={route("archived_chats.index")}
        className={clsx(
          "!block flex flex-1 items-center justify-center rounded-lg p-3 transition-all hover:bg-secondary sm:flex-initial",
          route().current("archived_chats.*") && "bg-secondary",
        )}
      >
        <BsStack className="m-auto h-6 w-6" />
        <p className="pt-1 text-center text-[12px]">거래제안</p>
      </Link>
      <Link
        href={route("archived_chats.index")}
        className={clsx(
          "!block flex flex-1 items-center justify-center rounded-lg p-3 transition-all hover:bg-secondary sm:flex-initial",
          route().current("archived_chats.*") && "bg-secondary",
        )}
      >
        <BsBank className="m-auto h-6 w-6" />
        <p className="pt-1 text-center text-[12px] ">신용거래</p>
      </Link>
      <Link
        href={route("chats.index")}
        className={clsx(
          "relative !block flex flex-1 items-center justify-center rounded-lg p-3 transition-all hover:bg-secondary sm:flex-initial",
          route().current("chats.*") && "bg-secondary",
        )}
      >
        <BsChat className="m-auto h-6 w-6" />
        <p className="pt-1 text-center text-[12px]">채팅</p>
        {notificationCount > 0 && <BadgeNotification />}
      </Link>

      <Link
        href={route("contacts.index")}
        className={clsx(
          "!block flex flex-1 items-center justify-center rounded-lg p-3 transition-all hover:bg-secondary sm:flex-initial",
          route().current("contacts.*") && "bg-secondary",
        )}
      >
        <BsPeople className="m-auto h-6 w-6" />
        <p className="pt-1 text-center text-[12px] ">회원</p>
      </Link>

      {width <= 640 ? (
        <Link
          href={route("preferences.index")}
          className={clsx(
            "!block flex flex-1 items-center justify-center rounded-lg p-3 transition-all hover:bg-secondary sm:flex-initial",
            route().current("preferences.index") && "bg-secondary",
          )}
        >
          <img
            src={auth.avatar}
            alt=""
            className="m-auto h-8 w-8 rounded-full border border-secondary sm:h-10 sm:w-10"
          />
          <p className="pt-1 text-center text-[12px]">나</p>
        </Link>
      ) : (
        <div className="relative flex flex-1 cursor-pointer items-center justify-center rounded-lg px-3 transition-all hover:bg-secondary sm:mt-auto sm:flex-initial sm:px-0 sm:hover:bg-transparent">
          <Dropdown>
            <Dropdown.Trigger>
              <img
                src={auth.avatar}
                alt=""
                className="h-8 w-8 rounded-full border border-secondary sm:h-10 sm:w-10"
              />
            </Dropdown.Trigger>

            <Dropdown.Content align="top-left" contentClasses="mb-12 sm:mb-10">
              <Dropdown.Button onClick={openPreferences}>
                <div className="flex items-center gap-2">
                  <BsGear />
                  설정
                </div>
              </Dropdown.Button>
              <Dropdown.Link href={route("profile.edit")}>
                <div className="flex items-center gap-2">
                  <BsPersonCircle />
                  개인정보
                </div>
              </Dropdown.Link>
              <Dropdown.Link href={route("logout")} method="post" as="button">
                <div className="flex items-center gap-2">
                  <BsBoxArrowRight />
                  로그아웃
                </div>
              </Dropdown.Link>
            </Dropdown.Content>
          </Dropdown>
        </div>
      )}
    </div>
  );
}
