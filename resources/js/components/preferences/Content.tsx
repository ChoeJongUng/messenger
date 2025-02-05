import clsx from "clsx";
import {
  BsAppIndicator,
  BsBan,
  BsBoxArrowRight,
  BsChevronDown,
  BsChevronRight,
  BsCircleHalf,
  BsKey,
  BsPersonCircle,
} from "react-icons/bs";
import Dropdown from "@/components/Dropdown";
import { useAppContext } from "@/contexts/app-context";
import { Switch } from "@headlessui/react";
import { updateUser } from "@/api/users";
import { useEffect, useState } from "react";
import UpdateProfileInformation from "@/pages/profile/partials/UpdateProfileInformationForm";
import UpdatePasswordForm from "@/pages/profile/partials/UpdatePasswordForm";
import DeleteUserForm from "@/pages/profile/partials/DeleteUserForm";
import { Link, router } from "@inertiajs/react";
import { useScreenSize } from "@/hooks/use-screen-size";

export default function Content() {
  const { theme, setTheme, auth, setAuth } = useAppContext();
  const [toggles, setToggles] = useState({
    profile: true,
    password: false,
    deleteAccount: false,
  });
  const { width } = useScreenSize();

  useEffect(() => {
    if (width > 640) {
      router.get(route("chats.index"));
    }
  }, [width]);

  const toggleActiveStatus = (status: boolean) => {
    updateUser(auth, { active_status: status }).then(() => {
      setAuth({ ...auth, active_status: status });
    });
  };

  return (
    <div className="order-1 flex flex-1 shrink-0 flex-col gap-2 sm:order-2 sm:flex sm:w-[320px] sm:flex-initial sm:border-l sm:border-secondary lg:w-[360px]">
      <div className="flex items-center justify-between px-2 pt-2 sm:pb-0">
        <h3 className="text-2xl font-semibold">설정</h3>
      </div>

      <div className="flex h-full max-h-[calc(100vh_-_106px)] flex-col gap-2 overflow-x-auto p-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-2 text-sm">
            <BsCircleHalf />
            테마
          </div>
          <Dropdown>
            <Dropdown.Trigger>
              <button className="btn btn-secondary flex items-center gap-2">
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
                <BsChevronDown />
              </button>
            </Dropdown.Trigger>

            <Dropdown.Content>
              <Dropdown.Button onClick={() => setTheme("system")}>
                시스템
              </Dropdown.Button>
              <Dropdown.Button onClick={() => setTheme("dark")}>
                다크모드
              </Dropdown.Button>
              <Dropdown.Button onClick={() => setTheme("light")}>
                라이트모드
              </Dropdown.Button>
            </Dropdown.Content>
          </Dropdown>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center gap-2 text-sm">
            <BsAppIndicator />
            온라인상태
          </div>

          <Switch
            checked={auth.active_status}
            onChange={toggleActiveStatus}
            className={clsx(
              "relative inline-flex h-6 w-11 items-center rounded-md",
              auth.active_status ? "bg-primary" : "bg-secondary",
            )}
          >
            <span className="sr-only">온라인상태 활성화</span>
            <span
              className={`${
                auth.active_status ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-md bg-white transition`}
            />
          </Switch>
        </div>

        <hr className="my-2 border-secondary" />
        {/* {toggles.profile && (
          <UpdateProfileInformation mustVerifyEmail className="max-w-xl" />
        )} */}
        {toggles.password && <UpdatePasswordForm className="max-w-xl" />}
        {toggles.deleteAccount && <DeleteUserForm className="max-w-xl" />}

        <div className="my-1" />

        {!toggles.profile && (
          <button
            className="btn btn-secondary"
            onClick={() =>
              setToggles({
                profile: true,
                password: false,
                deleteAccount: false,
              })
            }
          >
            <div className="flex items-center gap-2 text-sm">
              <BsPersonCircle />
              개인정보 업데이트
              <BsChevronRight className="ml-auto" />
            </div>
          </button>
        )}

        {!toggles.password && (
          <button
            className="btn btn-secondary"
            onClick={() =>
              setToggles({
                profile: false,
                password: true,
                deleteAccount: false,
              })
            }
          >
            <div className="flex items-center gap-2 text-sm">
              <BsKey />
              비밀번호 업데이트
              <BsChevronRight className="ml-auto" />
            </div>
          </button>
        )}

        {!toggles.deleteAccount && (
          <button
            className="btn btn-secondary"
            onClick={() =>
              setToggles({
                profile: false,
                password: false,
                deleteAccount: true,
              })
            }
          >
            <div className="flex items-center gap-2 text-sm">
              <BsBan />
              계정 삭제
              <BsChevronRight className="ml-auto" />
            </div>
          </button>
        )}

        <Link
          href={route("logout")}
          as="button"
          method="post"
          className="btn btn-secondary flex items-center gap-2"
        >
          <BsBoxArrowRight />
          로그아웃
          <BsChevronRight className="ml-auto" />
        </Link>
      </div>
    </div>
  );
}
