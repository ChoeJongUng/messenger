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
  const { auth, notificationCount, notificationCountGroup } = useAppContext();
  const { openModal } = useModalContext();
  const { width } = useScreenSize();
  console.log(notificationCount, notificationCountGroup);
  const openPreferences = () => {
    openModal({ view: "PREFERENCES", size: "lg" });
  };

  return (
    <div
      className={clsx(
        "fixed bottom-[0] order-2 mt-auto w-[-webkit-fill-available] flex-row justify-between bg-gray-200 sm:order-1 sm:mt-0 sm:flex sm:flex-col sm:items-center sm:justify-center sm:p-2",
        route().current("chats.show") ? "hidden" : "flex",
      )}
    >
      {/* <Link
        href={route("business.index")}
        className={clsx(
          "!block flex flex-1 items-center justify-center rounded-md p-3 transition-all hover:bg-secondary sm:flex-initial",
          
        )}
      >
        <img
            src={route().current("business.*")==true?"/images/ic_menu_mms1.png":"/images/ic_menu_mms0.png"}
            alt=""
            className="m-auto h-6 w-6"
          />
        <p className={route().current("business.*")?"pt-1 text-center text-[12px] text-[#07c160]":"pt-1 text-center text-[12px]"}>거래제안</p>
      </Link> */}
      <Link
        href={route("business.index")}
        className={clsx(
          "!block flex flex-1 items-center justify-center rounded-md p-3 transition-all hover:bg-secondary sm:flex-initial",
        )}
      >
        <img
          src={
            route().current("business.*") == true
              ? "/images/lv.png"
              : "/images/lu.png"
          }
          alt=""
          className="m-auto h-6 w-6"
        />
        <p
          className={
            route().current("business.*")
              ? "pt-1 text-center text-[12px] text-[#07c160]"
              : "pt-1 text-center text-[12px]"
          }
        >
          거래제안
        </p>
        {notificationCountGroup > 0 && <BadgeNotification />}
      </Link>
      <Link
        href={route("chats.index")}
        className={clsx(
          "relative !block flex flex-1 items-center justify-center rounded-md p-3 transition-all hover:bg-secondary sm:flex-initial",
        )}
      >
        <img
          src={
            route().current("chats.*") == true
              ? "/images/k_.png"
              : "/images/k9.png"
          }
          alt=""
          className="m-auto h-6 w-6"
        />
        <p
          className={
            route().current("chats.*")
              ? "pt-1 text-center text-[12px] text-[#07c160]"
              : "pt-1 text-center text-[12px]"
          }
        >
          채팅
        </p>
        {notificationCount > 0 && <BadgeNotification />}
      </Link>

      <Link
        href={route("contacts.index")}
        className={clsx(
          "!block flex flex-1 items-center justify-center rounded-md p-3 transition-all hover:bg-secondary sm:flex-initial",
        )}
      >
        <img
          src={
            route().current("contacts.*") == true
              ? "/images/kg.png"
              : "/images/kf.png"
          }
          alt=""
          className="m-auto h-6 w-6"
        />
        <p
          className={
            route().current("contacts.*")
              ? "pt-1 text-center text-[12px] text-[#07c160]"
              : "pt-1 text-center text-[12px]"
          }
        >
          회원
        </p>
      </Link>

      {width <= 640 ? (
        <Link
          href={route("profile.edit")}
          className={clsx(
            "!block flex flex-1 items-center justify-center rounded-md p-3 transition-all hover:bg-secondary sm:flex-initial",
          )}
        >
          <img
            src={
              route().current("preferences.index") == true ||
              route().current("profile.*") == true
                ? "/images/lq.png"
                : "/images/lp.png"
            }
            alt=""
            className="m-auto h-8 w-8 rounded-md sm:h-10 sm:w-10"
          />
          <p
            className={
              route().current("preferences.index") ||
              route().current("profile.*") == true
                ? "pt-1 text-center text-[12px] text-[#07c160]"
                : "pt-1 text-center text-[12px]"
            }
          >
            나
          </p>
        </Link>
      ) : (
        <div className="relative flex flex-1 cursor-pointer items-center justify-center rounded-md px-3 transition-all hover:bg-secondary sm:mt-auto sm:flex-initial sm:px-0 sm:hover:bg-transparent">
          <Dropdown>
            <Dropdown.Trigger>
              <img
                src="/images/lp.png"
                alt=""
                className="h-8 w-8 rounded-md sm:h-10 sm:w-10"
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
